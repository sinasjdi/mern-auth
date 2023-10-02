const User = require('../models/user')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
    comparePassword,
    hashPassword
} = require("../helpers/auth")
const jwt = require('jsonwebtoken');
const router = require('../routes/authRoutes');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;










const test = (req, res) => {
    res.json('test is working')
}


// Generate a random verification token
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
}


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.BACK_EMAIL_ADDR,
        pass: process.env.BACK_EMAIL_PASS, // Use the generated App Password or your Gmail password
    },
});


//Register user Endpoint

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        //check if name was entered
        const verificationToken = generateVerificationToken();
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }

        //check if name was entered

        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters.'
            })

        };
        //check email

        const exist = await User.findOne({
            email
        })
        if (exist) {
            return res.json({
                error: 'This email has been registered.'
            })
        }

        //hash password
        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verification: verificationToken,

        })

        const mailOptions = {
            from: process.env.BACK_EMAIL_ADDR,
            to: email,
            subject: 'Verify Your Email',
            html: `
              <p>Click the following link to verify your email:</p>
              <a href="${process.env.FRONT_URL}/verify/${verificationToken}">Verify Email</a>
            `,
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.json(user)
    } catch (error) {

        console.log(error)
    }
}


// Login Endpoint /// with jwt implementation if passwords match

const loginUser = async (req, res) => {

    try {
        const {
            email,
            password
        } = req.body;
        //check if user exists
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.json({
                error: 'No User found'
            })
        }
        if (user.isVerified == false) {

            return res.json({
                error: 'Please verify your email to login. An email has been sent to the email address you registered with.'
            })
        }



        const match = await comparePassword(password, user.password)





        if (match) {
            jwt.sign({
                email: user.email,
                id: user._id,
                name: user.name
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        if (!match) {
            return res.json({
                error: 'password do not match!'
            })
        }



    } catch (error) {
        console.log(error)
    }
}




// Endpoint to handle email verification
const verifyUser = async (req, res) => {

    const {
        token
    } = req.body


    try {
        // Find the user by verification token
        const user = await User.findOne({
            verification: token
        });

        if (!user) {
            return res.status(404).json({
                message: 'Token not found or expired.'
            });
        }

        // Mark the user as verified
        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            message: 'Email verification succeed.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Email verification failed.'
        });
    }

};





const updatedData = {
    username: 'newUsername',
    // Add other fields you want to update
};

const forgotPass = async (req, res) => {
    const {
        email
    } = req.body;
    const token = crypto.randomBytes(32).toString('hex');

    try {
        const user = await User.findOne({
            email
        });

        if (user) {
            // Update the user's passVerification field

            user.passVerification = token;
            await user.save(); // Save the updated user

            console.log('Updated User:', user);
            res.status(200).json({
                message: 'Password reset token updated successfully.'
            });
        } else {
            console.log('User not found with the provided email.');
            res.status(404).json({
                error: 'User not found with the provided email.'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'An error occurred while updating the password reset token.'
        });
    }

    // Create a password reset link
    const resetLink = `${process.env.FRONT_URL}/reset-password/${token}`;
    // Compose the email
    const mailOptions = {
        from: process.env.BACK_EMAIL_ADDR,
        to: email,
        subject: 'Password Reset Request',
        text: `You have requested a password reset. Click the following link to reset your password: ${resetLink}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({
                error: 'Failed to send password reset email.'
            });
        } else {
            console.log('Password reset email sent:', info.response);
            res.json({
                message: 'Password reset instructions sent to your email.'
            });
        }
    })
};



const resetPass = async (req, res) => {
    const {
        newPassword,
        token
    } = req.body;
    try {
        // Find the user associated with the reset token
        const user = await User.findOne({
            passVerification: token
        });

        if (!user) {
            return res.status(404).json({
                error: 'Password change token invalid!'
            });
        }
        // Check if the token is still valid (e.g., not expired)

        //if (tokenIsExpired(user.resetTokenExpiry)) {
        // return res.status(400).json({ error: 'Token has expired' });
        //}
        // Update the user's password

        user.passVerification = null;

        const hashedPassword = await hashPassword(newPassword)
        user.password = hashedPassword;
        // Save the updated user data
        await user.save();
        return res.status(200).json({
            message: 'Password reset successful'
        });


    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred'
        });

    }

}

const getProfile = (req, res) => {
    const {
        token
    } = req.cookies

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        console.log("JWT was not provided!")
        res.json(null)

    }

}



const getProfileViaGoogleToken = async (req, res) => {
    const token = req.body.token;


    try {
        // Find the user by verification token
        const user = await User.findOne({
            googleVerificationToken: token
        });

        if (!user) {
            return res.status(404).json({
                message: 'Token not found or expired.'
            });
        }

        jwt.sign({
            email: user.email,
            id: user._id,
            name: user.name
        }, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(user)
        })



    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'there was and error identifying the user'
        });
    }


}




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: `${process.env.BACK_URL}/auth/google/callback`,

}, (accessToken, refreshToken, profile, done) => {
    try {
        // Handle user data here
        //console.log(profile);
        done(null, profile);
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});








const googleCallback = async (req, res) => {
    try {
        console.log(req.user._json.email);

        const googleUser = await User.findOne({
            email: req.user._json.email
        });

        const GoogleVerification = generateVerificationToken();

        if (!googleUser) {
            const user = await User.create({
                name: req.user._json.given_name,
                email: req.user._json.email,
                isVerified: true,
                googleVerificationToken: GoogleVerification,
            });
            await user.save();
        } else {
            const updatedUser = await User.findOneAndUpdate({
                    email: req.user._json.email
                }, {
                    $set: {
                        googleVerificationToken: GoogleVerification
                    }
                }, {
                    new: true
                } // This option ensures that you get the updated user object back
            );

            if (!updatedUser) {
                throw new Error('Failed to update user.');
            }
        }

        // Redirect to the dashboard after successful authentication and database operations
        res.redirect(`${process.env.FRONT_URL}/googlelogin/${GoogleVerification}`);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    verifyUser,
    forgotPass,
    resetPass,
    googleCallback,
    getProfileViaGoogleToken,
}
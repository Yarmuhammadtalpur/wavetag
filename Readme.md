userSchema = {
username, == indexing
email, == indexing,
phoneNumber == indexing,
firstName,
lastName,
password: Hashed, crypto-SH512,
QrCode: '/imageUrl' == multer (project), ==> online url,
}

userProfileSchema = {
profilePicture: == multer (project) ==> online url,
user: user.\_id === indexing
address: Google Location // lat, lon, string address,
bio: string,
theme: theme.\_id
coverpicture,
cardTitle
}

userLinkSchema = {
user: user.\_id == indexing,
links: [
{
subLink: 'wavetags',
link: link._id // from linkSchema
}
]
}

linkSchema = {
name, ==> youtube, === indexing,
link: ==> youtube.com,
icon: ==> svg
}

themeSchema = {
name,
theme.\_id,
}

/Task ==> WAVETAG-123
Branch = WAVETAG-123

Pull Request. (Code Review, Approval)
Merge (develop)
#   w a v e t a g  
 
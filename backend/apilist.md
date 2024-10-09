#Tinder apis 


--authrouter--------------------------------
/post/signup
/post/login
/post/logout


--profilerouters--------------------------------
/get/profile/view
/patch/profile/edit
/patch/profile/password

--connectionrequest routers--------------------------------
/post/request/send/intereted/:userId
/post/request/send/ignored/:userId
/post/request/review/accepted/:userId
/post/request/review/rejected/:userId


---userrouters--------------------------------
get/user/connections 
get/user/requests/recieved
get/user/feed : get you the profile of other users on the platform 


status : ignore ,interested ,accepted ,rejected 

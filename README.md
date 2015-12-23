# ResShare
Introduction

ResShare is a P2P website where users can share their resumes and comments. 
The website is deployed on AWS Elasticbeanstalk. The application uses AWS SES, SQS, S3, elasticsearch, etc. Other databases locate on MongoDB and redis.

Instruction to use


The login page is here: http://resshare-env.elasticbeanstalk.com
Sign up for a new account if you haven’t had one. (Limited to AWS SES security verifications, some email service cannot be verified such as Sina and QQ email, sorry for the inconvenience). A notification email will be sent after you sign up. Click on the link in the email to activate your account. After that, go back to the login page to log in directly. You can also reset your password in My HomePage. 

After login, you will see activities of other users. You can click the link to comment/view the activity. You can also click on the default profile picture on top left to navigate to your home page. You can upload/share/delete/view your first resume by clicking “My Resume” list. (For now, we only support viewing pdf files). You can choose serveral tags which can best describe your resumes.  After sharing your first resume, click on “My HomePage” and then click on “My activity” to view the resume you just shared. When other users comment on your resume, you will get notifications. Click on “Notifications” on My HomePage to view and reply the comments. To search the resumes or users you are interested, type in key words in “Search Resume” on the left of navigation bar, a list of search results will be returned rated by the similarity. 

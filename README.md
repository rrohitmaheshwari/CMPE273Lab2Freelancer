# CMPE273Lab2Freelancer
CMPE273 Lab2 Freelancer

This lab covers designing and implementing distributed service oriented application using Kafka. 
Sessions should be stored in MongoDB.
Passwords need to be encrypted (usepassport).
Client and Server should communicate via KafkaStreams.

RESTful Services 
The next node.js based server you need to develop is the “Prototype of Freelancer application”. Everyone should create the account on Freelancerand see how it functions. 

Hey This server should perform the following tasks:
a)Basic Users functionalities:
1. Sign up new user (Name, Email and password)
2. Sign in existing user
3. Sign out. 
4. Profile (Profile Image, Name, Email, Phone Number, About Me, skills)
5. Users can update Profile anytime.To use the system, a user must login first to the system. Password must be encrypted.

b)Post ProjectFunctionality:
1.All Users can post project as an employer (Project Title, Project Description, File Upload, Skills Required, Budget Range)

c)Home:
1.Users  can  see  a  list  of  all  open  projects.  (ProjectName,  Description,  Skills Required, Employer, Budget Range, Number of Bid yet, Bid Now)
2.There are two types of List: 
(a) All Projects 
(b) Relevant Projects (least 3 skills of freelancer matchwith project technology stack).
3.Include  search  bar  where  you  can  search project  based  on  technology  stack  or Project name. Add pagination max 10 projects per page. Add a filter on status.

d) Details View:
1.Project Details.  (Project  Name,  Description,  Files,  Skills,  Budget  Range,  Average Bid)
2.All users can bid on the project. (Bid, Period in days)
3.List  of  All  bids.  (Profile  image,  Freelancer  Name,  Bid  Price,  Period  in  days,  Hire Button  only  visible  to an employer  of the project).  Include  sorting  filter  for  Bid(Ascending or Descending). 
4.Hire:  When an employer hiressomeone,  the freelancer  should  beinformed  by email.A Project should be assignedto that freelancer.
5.After  hiring  the  freelancer,  Details  view  modify  such  way  that  only  project details and submission panel (File upload, textbox) is there.[For Freelancer]
6.After  hiring  the  freelancer,  Details  view  modify  such  way  that  only  project details, “Make Payment”, and submission panel (employer can get solution) is there.[ For Employee] 
7.After  making  payment,  Project  should  be  closed.  Transaction  History  available to  both  freelancer  and  employer.(Note.  Bid  price  should  be  deducted  from employer account and added to freelancer account.)

e)Dashboard 
1.List of all projects you have bid on. (Project Name, Employer, Avg. Bid, your Bid, status of project). 
2.List of all Projects you have published as employer. (Project Name, Average Bid, Freelancer Name, Estimate Project completion Date, status)
3.Include  search  bar  for  searching  project  by  Name.  Add  pagination  max  10 projects per page. Add filter on status.

f)Transaction Manager
•Display total fund with below two features:
Add Money or Withdraw money
•Display incoming and outgoing transaction history.
•Produce Pie chart which is showing incoming and outgoing income. 

g) Should perform DB provided for database access.The Service should take care of exception that means validation is extremely important for this server. 



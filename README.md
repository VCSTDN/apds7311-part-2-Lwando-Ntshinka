<style>
:root {
    --dark_blue: #1a237e;
    --pale_blue: #3f51b5;
    --accent: #7986cb;
    --background_blue: #e8eaf6;
    --text: #121212;
  }
  
  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--background_blue);
    color: var(--text);
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  nav {
    background-color: var(--dark_blue);
    padding: 10px 0;
  }
  
  nav ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
  }
  
  nav ul li {
    margin: 0 10px;
  }
  
  nav ul li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  #, ## {
    color: var(--dark_blue);
  }
</style>
#APDS 7311 Task 1- Banking International


##Table of Contents


##Contributers
    -Lesedi Maela
    -Christian Lombo
    -Ratjatji Malatji
    -Nqobile Sibiya
    -Olifile Seilane
    -Lwando Ntshinka



##Description
Banking International is a customer oriented banking that prioritises security for users when paming international transactions. Users are able to login and view previous payments and make payments that will be approved by the bank employees. 

The following security measures have been taken into consideration for the appliation:
  - Load Balancing
  - Rate Limiting
  - TLS Encryption
  - Pasword hashing
  - Session token generation
  - Password hashing and salting
  - SSL Digital Certificates

This part will feature the customer and employee portal.

##Requirements
The following is required to ensure that the application will function as intented:
i5 or Equivalent CPU
8GB RAM
MB Storage
Visual studio code



##Intructions
The project comprises of various folders that can be run on a browser. The default port for the application is 433. The alternative port is 8443

###Dummy data credentals:
Customer:
{
    "username": "emWhite",
    "accountNumber": "9700256294",
    "password": "@December1994"
}

{
    "username": "tbodessonk",
    "accountNumber": "2920204122",
    "password": "myPassword789"
}


##References
Anthropic. (2024). Conversation with Claude AI assistant. [Online]. Available at:</br> https://claude.ai/new [Accessed: 16 September 2024].

Bito. [s.a.]. Sanitize Input Javascript: Javascript Explained, [s.a.]. [Online]. Available at:</br> https://bito.ai/resources/sanitize-input-javascript-javascript-explained/ [Accessed: 30 September 2024]. </br></br>

Dev. 2021. How to make a loading screen for an iframe using functional components in React , 14 November 2021. [Online].</br> Available at: https://dev.to/apc518/how-to-make-a-loading-screen-for-an-iframe-using-functional-components-in-react-2970 [Accessed: 30 September 2024]. </br></br>

Geeks for Geeks. 2021. Node.js Securing Apps with Helmet.js, 8 October 2021. [Online]. Available at:</br> https://www.geeksforgeeks.org/node-js-securing-apps-with-helmet-js/ [Accessed: 5 October 2024]. </br></br>

GitHub Docs. [s.a.] Duplicating a repository, [s.a.]. [Online] Available at: https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository [Accessed: 8 October 2024]. </br></br>


Gitlab. [s.a.] How to enable or disable GitLab CI/CD, [s.a.]. [Online] Available at:
https://gitlab.cn/docs/14.0/ee/ci/enable_or_disable_ci.html</br> [Accessed: 5 October 2024]. </br></br>

Helmet.js. [s.a.] Get started, [s.a.]. [Online] Available at:</br> https://helmetjs.github.io/ [Accessed: 5 October 2024]. </br></br>

Medium. 2018. Rate limiting, brute force and DDoS attacks protection in Node.js, 4 June 2018. [Online]. Available at: https://medium.com/@animirr/rate-limiting-brute-force-and-ddos-attacks-protection-in-node-js-2492c4a9249 [Accessed: 30 September 2024]. </br></br>

Medium. 2021. JSON Web Token (JWT) in node.js (Implementing using Refresh token), 20 March 2021. [Online]. </br> Available at: https://kettan007.medium.com/json-web-token-jwt-in-node-js-implementing-using-refresh-token-90e24e046cf8 [Accessed: 30 September 2024]. </br></br>

Medium. 2021. Load balancing your NodeJS app with NGINX and PM2, 5 November 2021. [Online]. Available at: https://bencoderus.medium.com/load-balancing-your-nodejs-server-with-nginx-and-pm2-8095f558da2e [Accessed: 30 September 2024]. </br></br>

MongoDB. https://www.mongodb.com/docs/atlas/atlas-ui/documents/

OpenAI. 2024. Chat-GPT (Version 4.0). [Large language model]. Available at:</br>
https://chat.openai.com/ [Accessed: 30 August 2024].

Open Classroom. Go Full-Stack With Node.js, Express, and MongoDB, 21 February 2022. [Online].</br> Available at:  https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656221-save-and-retrieve-data [Accessed: 16 September 2024]. </br></br>

Quora. [s.a.].  How do you get user info from MongoDB in Node.js (node.js, MongoDB, development), [s.a.]. [Online]. Available at: https://www.quora.com/How-do-you-get-user-info-from-MongoDB-in-Node-js-node-js-MongoDB-development [Accessed: 30 September 2024]. </br></br>

Reflectiz. 2023. 7 Required Steps to Secure Your iFrames Security, 4 January 2023. [Online].</br> Available at: https://www.reflectiz.com/blog/iframe-security/ [Accessed: 30 September 2024]. </br></br>

StackOverflow. 2023. How to get a particular user data from MongoDB in node.js, 2023. [Online].</br> Available at: https://stackoverflow.com/questions/75217026/how-to-get-a-particular-user-data-from-mongodb-in-node-js [Accessed: 30 September 2024]. </br></br>

StackOverflow. 2009. Generate random string/characters in JavaScript, 28 August 2009. [Online].</br> Available at: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript [Accessed: 30 September 2024]. </br></br>

VLink. 2024. How to build a CI/CD pipeline with GitHub Actions, 26 February 2024. [Online].</br> Available at: https://www.vlinkinfo.com/blog/how-to-build-a-cicd-pipeline/ [Accessed: 8 October 2024]. </br></br>
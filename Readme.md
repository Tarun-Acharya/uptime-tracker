Building a **Global Uptime Tracker** is an excellent full-stack project that combines frontend development with React, backend development with Python, and serverless computing using AWS Lambda. This comprehensive guide will walk you through every step of creating a cost-effective, scalable, and user-friendly uptime tracker. You can download this guide for future reference.

---

## **Table of Contents**

1. [Project Overview](#1-project-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Frontend Development with React](#4-frontend-development-with-react)
   - [4.1. Setting Up the React Project](#41-setting-up-the-react-project)
   - [4.2. Creating Components](#42-creating-components)
   - [4.3. Implementing API Calls](#43-implementing-api-calls)
   - [4.4. Displaying Results](#44-displaying-results)
   - [4.5. Styling the Application](#45-styling-the-application)
   - [4.6. Deploying the Frontend](#46-deploying-the-frontend)
5. [Backend Development with Python](#5-backend-development-with-python)
   - [5.1. Setting Up the Python Environment](#51-setting-up-the-python-environment)
   - [5.2. Creating the Backend API with FastAPI](#52-creating-the-backend-api-with-fastapi)
   - [5.3. Interacting with AWS Lambda Functions](#53-interacting-with-aws-lambda-functions)
   - [5.4. Deploying the Backend](#54-deploying-the-backend)
6. [Deploying Monitoring Agents with AWS Lambda](#6-deploying-monitoring-agents-with-aws-lambda)
   - [6.1. Setting Up AWS Account and CLI](#61-setting-up-aws-account-and-cli)
   - [6.2. Creating the Lambda Function](#62-creating-the-lambda-function)
   - [6.3. Deploying Lambda Functions to Multiple Regions](#63-deploying-lambda-functions-to-multiple-regions)
   - [6.4. Setting Up API Gateway](#64-setting-up-api-gateway)
7. [Integrating Everything Together](#7-integrating-everything-together)
8. [Database Integration (Optional)](#8-database-integration-optional)
9. [Security and Best Practices](#9-security-and-best-practices)
10. [Cost Management](#10-cost-management)
11. [Testing Your Application](#11-testing-your-application)
12. [Additional Enhancements](#12-additional-enhancements)
13. [Conclusion](#13-conclusion)

---

## **1. Project Overview**

The **Global Uptime Tracker** allows users to input a website URL, which the application then checks for availability from multiple regions worldwide. The results, including the status (Up/Down) and response times, are displayed to the user in a comprehensive dashboard.

**Key Features:**

- **URL Submission:** Users can submit a website URL for monitoring.
- **Global Monitoring:** The application checks the website's uptime from various geographic regions using AWS Lambda functions.
- **Results Display:** Users see the status and response times from each region.
- **Real-Time Updates:** The dashboard updates results in real-time as checks are completed.

---

## **2. High-Level Architecture**

![Architecture Diagram](https://i.imgur.com/yourarchitecturediagram.png) _(Placeholder for architecture diagram)_

**Components:**

1. **Frontend (React):**

   - User Interface for submitting URLs and viewing results.
   - Communicates with the backend API.

2. **Backend (Python FastAPI):**

   - Receives URL submissions from the frontend.
   - Initiates uptime checks by invoking AWS Lambda functions in different regions.
   - Aggregates and processes results.
   - Sends results back to the frontend.

3. **Monitoring Agents (AWS Lambda):**

   - Deployed in multiple AWS regions.
   - Perform HTTP requests to the target URL.
   - Return status and response time.

4. **API Gateway:**

   - Exposes Lambda functions via HTTP endpoints.

5. **(Optional) Database:**
   - Stores historical uptime data for analysis and trends.

---

## **3. Prerequisites**

Before diving into development, ensure you have the following:

- **Basic Knowledge:**

  - React.js for frontend development.
  - Python programming.
  - AWS services (Lambda, API Gateway).

- **Tools and Accounts:**

  - **AWS Account:** [Sign up here](https://aws.amazon.com/).
  - **Node.js and npm:** [Download Node.js](https://nodejs.org/).
  - **Python 3.7+**
  - **Git:** [Download Git](https://git-scm.com/downloads).
  - **AWS CLI:** [Install AWS CLI](https://aws.amazon.com/cli/).
  - **Code Editor:** [Visual Studio Code](https://code.visualstudio.com/) or your preferred editor.

- **Cost Considerations:**
  - Utilize AWS Free Tier where possible.
  - Monitor AWS usage to stay within budget.

---

## **4. Frontend Development with React**

### **4.1. Setting Up the React Project**

1. **Initialize the React App:**

   Open your terminal and run:

   ```bash
   npx create-react-app uptime-tracker-frontend
   cd uptime-tracker-frontend
   ```

2. **Install Dependencies:**

   Install `axios` for API calls and `react-router-dom` if you plan to implement routing:

   ```bash
   npm install axios react-router-dom
   ```

### **4.2. Creating Components**

We'll create the following components:

- **App:** Main component.
- **Header:** Application header.
- **URLForm:** Form for submitting URLs.
- **Results:** Displaying uptime results.
- **Footer:** Application footer.

1. **Create Component Structure:**

   Inside `src/`, create a folder named `components`.

   ```bash
   mkdir src/components
   ```

2. **Header Component:**

   ```jsx
   // src/components/Header.js
   import React from "react";

   const Header = () => (
     <header>
       <h1>Global Uptime Tracker</h1>
     </header>
   );

   export default Header;
   ```

3. **URLForm Component:**

   ```jsx
   // src/components/URLForm.js
   import React, { useState } from "react";
   import axios from "axios";

   const URLForm = ({ setResults, setLoading }) => {
     const [url, setUrl] = useState("");

     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {
         const response = await axios.post(
           "https://your-backend-api.com/check",
           { url }
         );
         setResults(response.data);
       } catch (error) {
         console.error(error);
         alert("Error checking uptime. Please try again.");
       }
       setLoading(false);
     };

     return (
       <form onSubmit={handleSubmit}>
         <input
           type="url"
           value={url}
           onChange={(e) => setUrl(e.target.value)}
           placeholder="Enter website URL"
           required
         />
         <button type="submit">Check Uptime</button>
       </form>
     );
   };

   export default URLForm;
   ```

4. **Results Component:**

   ```jsx
   // src/components/Results.js
   import React from "react";

   const Results = ({ results }) => (
     <div className="results">
       <h2>Uptime Results:</h2>
       <ul>
         {results.map((result) => (
           <li key={result.region}>
             <strong>{result.region}:</strong> {result.status}{" "}
             {result.responseTime !== null &&
               `(Response Time: ${result.responseTime} ms)`}
           </li>
         ))}
       </ul>
     </div>
   );

   export default Results;
   ```

5. **Footer Component:**

   ```jsx
   // src/components/Footer.js
   import React from "react";

   const Footer = () => (
     <footer>
       <p>&copy; {new Date().getFullYear()} Global Uptime Tracker</p>
     </footer>
   );

   export default Footer;
   ```

6. **App Component Integration:**

   ```jsx
   // src/App.js
   import React, { useState } from "react";
   import Header from "./components/Header";
   import URLForm from "./components/URLForm";
   import Results from "./components/Results";
   import Footer from "./components/Footer";
   import "./App.css";

   function App() {
     const [results, setResults] = useState(null);
     const [loading, setLoading] = useState(false);

     return (
       <div className="App">
         <Header />
         <URLForm setResults={setResults} setLoading={setLoading} />
         {loading && <p>Checking uptime...</p>}
         {results && <Results results={results} />}
         <Footer />
       </div>
     );
   }

   export default App;
   ```

### **4.3. Implementing API Calls**

- **Proxy Setup (Optional):**

  To avoid CORS issues during development, you can set a proxy in `package.json`:

  ```json
  // package.json
  {
    // ... other configurations
    "proxy": "https://your-backend-api.com"
  }
  ```

  Alternatively, configure CORS properly in the backend.

- **Handling API URLs:**

  Replace `'https://your-backend-api.com/check'` with your actual backend API endpoint.

### **4.4. Displaying Results**

The `Results` component displays an unordered list of results, each showing:

- **Region Name**
- **Status (Up/Down)**
- **Response Time (if available)**

For enhanced visualization, consider integrating charts or maps (covered later).

### **4.5. Styling the Application**

1. **Basic Styling with CSS:**

   ```css
   /* src/App.css */
   .App {
     text-align: center;
     max-width: 800px;
     margin: 0 auto;
     padding: 20px;
     font-family: Arial, sans-serif;
   }

   header {
     background-color: #282c34;
     padding: 20px;
     color: white;
   }

   form {
     margin: 20px 0;
   }

   input[type="url"] {
     width: 70%;
     padding: 10px;
     margin-right: 10px;
     border: 1px solid #ccc;
     border-radius: 4px;
   }

   button {
     padding: 10px 20px;
     border: none;
     background-color: #61dafb;
     color: #fff;
     border-radius: 4px;
     cursor: pointer;
   }

   button:hover {
     background-color: #21a1f1;
   }

   .results {
     text-align: left;
     margin-top: 20px;
   }

   footer {
     margin-top: 40px;
     color: #777;
   }
   ```

2. **Advanced Styling:**

   - **UI Libraries:** Integrate libraries like [Material-UI](https://mui.com/) or [Bootstrap](https://getbootstrap.com/) for advanced components and responsive design.
   - **Chart Libraries:** Use [Chart.js](https://www.chartjs.org/) or [Recharts](https://recharts.org/en-US/) for data visualization.

### **4.6. Deploying the Frontend**

**Using Netlify:**

1. **Push Code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/uptime-tracker-frontend.git
   git push -u origin master
   ```

2. **Connect Repository to Netlify:**

   - Log in to [Netlify](https://www.netlify.com/).
   - Click on **"New site from Git"**.
   - Select your repository and follow the prompts to deploy.

**Using Vercel:**

1. **Push Code to GitHub (if not already done).**

2. **Connect Repository to Vercel:**

   - Log in to [Vercel](https://vercel.com/).
   - Click on **"New Project"**.
   - Select your repository and deploy.

---

## **5. Backend Development with Python**

We'll use **FastAPI** for the backend due to its performance and ease of use.

### **5.1. Setting Up the Python Environment**

1. **Create Backend Directory:**

   ```bash
   mkdir uptime-tracker-backend
   cd uptime-tracker-backend
   ```

2. **Set Up Virtual Environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**

   ```bash
   pip install fastapi uvicorn requests boto3
   ```

   - **fastapi:** Web framework.
   - **uvicorn:** ASGI server.
   - **requests:** HTTP requests.
   - **boto3:** AWS SDK for Python.

4. **Initialize Git Repository:**

   ```bash
   git init
   ```

### **5.2. Creating the Backend API with FastAPI**

1. **Create `main.py`:**

   ```python
   # main.py
   from fastapi import FastAPI, HTTPException
   from pydantic import BaseModel, HttpUrl
   import requests
   import os
   from typing import List
   import asyncio
   import aiohttp

   app = FastAPI()

   class CheckRequest(BaseModel):
       url: HttpUrl

   class CheckResult(BaseModel):
       region: str
       status: str
       responseTime: float = None

   # List of AWS Lambda API endpoints in different regions
   AGENTS = [
       {"region": "us-east-1", "url": os.getenv("AGENT_US_EAST_1")},
       {"region": "eu-west-1", "url": os.getenv("AGENT_EU_WEST_1")},
       {"region": "ap-southeast-1", "url": os.getenv("AGENT_AP_SOUTHEAST_1")},
       # Add more regions as needed
   ]

   async def fetch(session, agent_url, url):
       try:
           payload = {"url": url}
           async with session.post(agent_url, json=payload, timeout=10) as resp:
               if resp.status == 200:
                   data = await resp.json()
                   return CheckResult(
                       region=data.get("region", "Unknown"),
                       status=data.get("status", "Unknown"),
                       responseTime=data.get("responseTime")
                   )
               else:
                   return CheckResult(
                       region="Unknown",
                       status="Error",
                       responseTime=None
                   )
       except Exception as e:
           print(f"Error fetching from {agent_url}: {e}")
           return CheckResult(
               region="Unknown",
               status="Error",
               responseTime=None
           )

   @app.post("/check", response_model=List[CheckResult])
   async def check_uptime(request: CheckRequest):
       url = request.url
       async with aiohttp.ClientSession() as session:
           tasks = []
           for agent in AGENTS:
               tasks.append(fetch(session, agent["url"], url))
           results = await asyncio.gather(*tasks)
       return results
   ```

2. **Environment Variables:**

   Create a `.env` file to store the Lambda API endpoints.

   ```bash
   touch .env
   ```

   ```env
   # .env
   AGENT_US_EAST_1=https://api-us-east-1.amazonaws.com/check
   AGENT_EU_WEST_1=https://api-eu-west-1.amazonaws.com/check
   AGENT_AP_SOUTHEAST_1=https://api-ap-southeast-1.amazonaws.com/check
   ```

   **Note:** Replace the URLs with your actual API Gateway endpoints.

3. **Load Environment Variables:**

   Install `python-dotenv` to load environment variables.

   ```bash
   pip install python-dotenv
   ```

   Modify `main.py` to load the `.env` file:

   ```python
   # main.py
   from fastapi import FastAPI, HTTPException
   from pydantic import BaseModel, HttpUrl
   import requests
   import os
   from typing import List
   import asyncio
   import aiohttp
   from dotenv import load_dotenv

   load_dotenv()

   app = FastAPI()

   # Rest of the code remains the same
   ```

### **5.3. Interacting with AWS Lambda Functions**

To invoke AWS Lambda functions from the backend, you can use **boto3**. However, in our current architecture, the Lambda functions are exposed via API Gateway, so we can interact with them using HTTP requests instead.

Therefore, in this guide, we'll use HTTP requests to interact with the Lambda functions via their API Gateway URLs, as shown in the `AGENTS` list.

### **5.4. Deploying the Backend**

**Option 1: Deploying on Vercel**

Vercel primarily supports serverless functions written in JavaScript/TypeScript. To deploy a Python FastAPI backend, consider using alternative platforms like **Render.com** or **Heroku**.

**Option 2: Deploying on Render.com**

1. **Create a Repository:**

   Push your backend code to GitHub:

   ```bash
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/uptime-tracker-backend.git
   git push -u origin master
   ```

2. **Sign Up and Create a New Service:**

   - Log in to [Render.com](https://render.com/).
   - Click on **"New"** and select **"Web Service"**.
   - Connect your GitHub repository.
   - Choose **Python** as the environment.
   - Specify the build and start commands:

     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`

   - Add environment variables for the agent URLs from your `.env` file.

3. **Deploy:**

   Render will automatically build and deploy your backend. Once deployed, note the service URL to use in the frontend.

---

## **6. Deploying Monitoring Agents with AWS Lambda**

Deploying monitoring agents in multiple AWS regions allows you to check website uptime from diverse geographic locations.

### **6.1. Setting Up AWS Account and CLI**

1. **Create an AWS Account:**

   - [Sign up for AWS](https://aws.amazon.com/).

2. **Install AWS CLI:**

   - Follow the [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).

3. **Configure AWS CLI:**

   ```bash
   aws configure
   ```

   - **AWS Access Key ID:** Your access key.
   - **AWS Secret Access Key:** Your secret key.
   - **Default region name:** e.g., `us-east-1`.
   - **Default output format:** `json`.

### **6.2. Creating the Lambda Function**

1. **Create the Lambda Function Code:**

   Create a new directory for your Lambda function:

   ```bash
   mkdir lambda_function
   cd lambda_function
   ```

   Create `handler.py`:

   ```python
   # handler.py
   import json
   import requests
   import time

   def lambda_handler(event, context):
       try:
           body = json.loads(event['body'])
           url = body['url']
       except Exception as e:
           return {
               'statusCode': 400,
               'body': json.dumps({'error': 'Invalid request payload'})
           }

       start_time = time.time()
       try:
           response = requests.get(url, timeout=10)
           response_time = (time.time() - start_time) * 1000  # in ms
           status = 'Up' if response.status_code == 200 else 'Down'
       except requests.exceptions.RequestException:
           response_time = None
           status = 'Down'

       region = event['requestContext']['identity']['sourceIp']  # Placeholder

       return {
           'statusCode': 200,
           'body': json.dumps({
               'region': event['awsRegion'],
               'status': status,
               'responseTime': response_time
           }),
           'headers': {
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin': '*'  # Enable CORS
           }
       }
   ```

   **Notes:**

   - **CORS:** Added headers to allow cross-origin requests.
   - **Region:** Using `event['awsRegion']` to identify the region where the function is running.

2. **Create `requirements.txt`:**

   ```txt
   requests
   ```

3. **Package the Lambda Function:**

   Install dependencies locally and package them with your code:

   ```bash
   pip install -r requirements.txt -t .
   zip -r lambda_function.zip .
   ```

### **6.3. Deploying Lambda Functions to Multiple Regions**

Repeat the following steps for each desired AWS region.

1. **Select a Region:**

   For example, `us-east-1`, `eu-west-1`, `ap-southeast-1`, etc.

2. **Create the Lambda Function:**

   ```bash
   aws lambda create-function \
     --function-name UptimeChecker \
     --runtime python3.9 \
     --role arn:aws:iam::your-account-id:role/your-lambda-role \
     --handler handler.lambda_handler \
     --zip-file fileb://lambda_function.zip \
     --region your-selected-region \
     --timeout 10 \
     --memory-size 128
   ```

   **Notes:**

   - **IAM Role:** Ensure you have an IAM role with the necessary permissions (`AWSLambdaBasicExecutionRole`).

3. **Update the Lambda Function Code (for existing functions):**

   If updating an existing function:

   ```bash
   aws lambda update-function-code \
     --function-name UptimeChecker \
     --zip-file fileb://lambda_function.zip \
     --region your-selected-region
   ```

4. **Repeat for Each Region:**

   Change the `--region` parameter accordingly and repeat the deployment steps.

### **6.4. Setting Up API Gateway**

Expose each Lambda function via API Gateway to create HTTP endpoints.

1. **Create API Gateway:**

   ```bash
   aws apigateway create-rest-api \
     --name 'UptimeCheckerAPI' \
     --region your-selected-region
   ```

   - **Note:** Capture the `id` from the response for further steps.

2. **Get Root Resource ID:**

   ```bash
   aws apigateway get-resources \
     --rest-api-id your-rest-api-id \
     --region your-selected-region
   ```

   - Find the `id` of the root resource (`/`).

3. **Create a POST Method:**

   ```bash
   aws apigateway put-method \
     --rest-api-id your-rest-api-id \
     --resource-id root-resource-id \
     --http-method POST \
     --authorization-type NONE \
     --region your-selected-region
   ```

4. **Integrate the POST Method with Lambda:**

   ```bash
   aws apigateway put-integration \
     --rest-api-id your-rest-api-id \
     --resource-id root-resource-id \
     --http-method POST \
     --type AWS_PROXY \
     --integration-http-method POST \
     --uri arn:aws:apigateway:your-selected-region:lambda:path/2015-03-31/functions/arn:aws:lambda:your-selected-region:your-account-id:function:UptimeChecker/invocations \
     --region your-selected-region
   ```

5. **Deploy the API:**

   ```bash
   aws apigateway create-deployment \
     --rest-api-id your-rest-api-id \
     --stage-name prod \
     --region your-selected-region
   ```

6. **Enable CORS (Optional but Recommended):**

   ```bash
   aws apigateway put-method-response \
     --rest-api-id your-rest-api-id \
     --resource-id root-resource-id \
     --http-method POST \
     --status-code 200 \
     --response-parameters '{"method.response.header.Access-Control-Allow-Origin":true}' \
     --region your-selected-region

   aws apigateway put-integration-response \
     --rest-api-id your-rest-api-id \
     --resource-id root-resource-id \
     --http-method POST \
     --status-code 200 \
     --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'*'"}' \
     --region your-selected-region
   ```

7. **Note the API Endpoint URL:**

   After deployment, your API endpoint will look like:

   ```
   https://{api_id}.execute-api.{region}.amazonaws.com/prod
   ```

8. **Repeat for Each Region:**

   Deploy API Gateway for each Lambda function in their respective regions.

---

## **7. Integrating Everything Together**

Now that the frontend, backend, and monitoring agents are set up, integrate them to work seamlessly.

### **7.1. Backend Configuration**

1. **Update Environment Variables:**

   Ensure the backend has environment variables for each agent's API Gateway URL.

   Example `.env` for backend:

   ```env
   AGENT_US_EAST_1=https://api-id-us-east-1.execute-api.us-east-1.amazonaws.com/prod
   AGENT_EU_WEST_1=https://api-id-eu-west-1.execute-api.eu-west-1.amazonaws.com/prod
   AGENT_AP_SOUTHEAST_1=https://api-id-ap-southeast-1.execute-api.ap-southeast-1.amazonaws.com/prod
   ```

2. **Ensure Backend Has Access to These Variables:**

   - In Render.com, add these environment variables in the service settings.

### **7.2. Frontend Configuration**

1. **Set Backend API Endpoint:**

   In `URLForm.js`, replace `'https://your-backend-api.com/check'` with your actual backend URL deployed on Render.com.

   ```jsx
   // Example:
   const response = await axios.post(
     "https://uptime-tracker-backend.onrender.com/check",
     { url }
   );
   ```

### **7.3. Testing the Integration**

1. **Start Both Frontend and Backend Locally:**

   - **Backend:**

     ```bash
     uvicorn main:app --reload
     ```

   - **Frontend:**

     ```bash
     npm start
     ```

2. **Submit a URL:**

   - Open the frontend in your browser (usually at `http://localhost:3000`).
   - Enter a valid website URL and submit.
   - Observe the results fetched from different regions.

3. **Check for Errors:**

   - Ensure CORS is properly configured.
   - Verify API endpoints are correctly set.
   - Check Lambda function logs in AWS for any runtime errors.

---

## **8. Database Integration (Optional)**

For historical data tracking, integrating a database is beneficial.

### **8.1. Choosing a Database**

- **MongoDB Atlas:** Free tier with 512 MB storage.
- **PostgreSQL on Render.com or Heroku:** Free tiers available.

### **8.2. Setting Up MongoDB Atlas**

1. **Create an Account:**

   - [Sign up for MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

2. **Create a Cluster:**

   - Choose the free tier (M0) and select a cloud provider.

3. **Create a Database User:**

   - Note down the username and password.

4. **Whitelist Your IP:**

   - Allow access from anywhere (`0.0.0.0/0`) for development purposes.

5. **Get the Connection String:**

   - Replace `<password>` with your database password.

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/uptime_tracker?retryWrites=true&w=majority
   ```

### **8.3. Integrate MongoDB with Backend**

1. **Install `motor` (Async MongoDB Driver):**

   ```bash
   pip install motor
   ```

2. **Update `main.py`:**

   ```python
   # main.py
   from motor.motor_asyncio import AsyncIOMotorClient
   from dotenv import load_dotenv
   import os

   load_dotenv()

   app = FastAPI()

   # MongoDB Setup
   client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
   db = client.uptime_tracker
   results_collection = db.results

   # Modify the check_uptime endpoint to save results
   @app.post("/check", response_model=List[CheckResult])
   async def check_uptime(request: CheckRequest):
       url = request.url
       async with aiohttp.ClientSession() as session:
           tasks = []
           for agent in AGENTS:
               tasks.append(fetch(session, agent["url"], url))
           results = await asyncio.gather(*tasks)

       # Save to database
       for result in results:
           document = {
               "url": str(url),
               "region": result.region,
               "status": result.status,
               "responseTime": result.responseTime,
               "timestamp": datetime.utcnow()
           }
           await results_collection.insert_one(document)

       return results
   ```

3. **Add Required Imports:**

   ```python
   from datetime import datetime
   ```

### **8.4. Update Backend Deployment**

- **Ensure `MONGODB_URI` is added to Render.com's environment variables.**

---

## **9. Security and Best Practices**

### **9.1. CORS Configuration**

Ensure your backend allows requests from your frontend domain.

1. **Install `fastapi-cors`:**

   ```bash
   pip install fastapi-cors
   ```

2. **Update `main.py`:**

   ```python
   from fastapi.middleware.cors import CORSMiddleware

   origins = [
       "https://your-frontend-domain.com",
       "http://localhost:3000",
   ]

   app.add_middleware(
       CORSMiddleware,
       allow_origins=origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### **9.2. Environment Variables**

- **Never commit sensitive information** (like API keys) to version control.
- Use `.env` files locally and configure environment variables in your deployment platform.

### **9.3. Input Validation**

Ensure the URL submitted by the user is valid to prevent server-side errors or abuse.

- **Used Pydantic's `HttpUrl` for URL validation in `CheckRequest`.**

### **9.4. Rate Limiting**

Prevent abuse by limiting how frequently users can submit checks.

1. **Install `slowapi`:**

   ```bash
   pip install slowapi
   ```

2. **Update `main.py`:**

   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   from fastapi import Request
   from starlette.responses import JSONResponse

   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   app.add_exception_handler(429, _rate_limit_exceeded_handler)

   @app.post("/check", response_model=List[CheckResult])
   @limiter.limit("10/minute")
   async def check_uptime(request: CheckRequest, req: Request):
       # Existing code
   ```

### **9.5. HTTPS Everywhere**

Ensure all API calls and frontend interactions use HTTPS to secure data in transit.

- **Deployed platforms like Render.com, Netlify, and Vercel provide HTTPS by default.**

---

## **10. Cost Management**

Staying within a **$50-100 per year** budget requires careful monitoring.

### **10.1. AWS Costs**

- **Lambda Functions:**

  - **Free Tier:** 1 million free requests and 400,000 GB-seconds per month.
  - **Estimated Usage:** Well within free tier for personal projects.

- **API Gateway:**

  - **Free Tier:** 1 million API calls per month.
  - **Estimated Usage:** Sufficient for low traffic.

- **Monitoring:**
  - Regularly check AWS billing dashboard.
  - Set up billing alerts to notify you when approaching limits.

### **10.2. Render.com Costs**

- **Free Tier:** Suitable for small projects.
- **Paid Plans:** If needed, start with the lowest tier ($7/month).

### **10.3. MongoDB Atlas Costs**

- **Free Tier:** 512 MB, sufficient for basic usage.
- **Upgrades:** Available if you expand features.

### **10.4. Domain Registration**

- **Optional:** Use a custom domain for ~$10-15/year from providers like Namecheap or Google Domains.
- **Alternative:** Use free subdomains provided by Netlify or Vercel.

### **10.5. Monitoring and Optimization**

- **Optimize Lambda Function Code:** Reduce execution time and memory usage.
- **Limit API Calls:** Implement rate limiting and caching where possible.
- **Use Free Tiers Wisely:** Ensure services remain within free usage limits.

---

## **11. Testing Your Application**

### **11.1. Frontend Testing**

1. **Manual Testing:**

   - Submit various URLs to ensure correct behavior.
   - Test edge cases like invalid URLs, unreachable sites, etc.

2. **Automated Testing:**

   - **Install Testing Libraries:**

     ```bash
     npm install --save-dev jest @testing-library/react @testing-library/jest-dom
     ```

   - **Create Tests:**

     Example for `URLForm`:

     ```jsx
     // src/components/__tests__/URLForm.test.js
     import { render, screen, fireEvent } from "@testing-library/react";
     import URLForm from "../URLForm";

     test("renders URL form and submits correctly", () => {
       const setResults = jest.fn();
       const setLoading = jest.fn();
       render(<URLForm setResults={setResults} setLoading={setLoading} />);

       const input = screen.getByPlaceholderText(/Enter website URL/i);
       const button = screen.getByText(/Check Uptime/i);

       fireEvent.change(input, {
         target: { value: "https://www.example.com" },
       });
       fireEvent.click(button);

       expect(setLoading).toHaveBeenCalledWith(true);
     });
     ```

   - **Run Tests:**

     ```bash
     npm test
     ```

### **11.2. Backend Testing**

1. **Install Testing Libraries:**

   ```bash
   pip install pytest httpx
   ```

2. **Create `test_main.py`:**

   ```python
   # test_main.py
   from fastapi.testclient import TestClient
   from main import app

   client = TestClient(app)

   def test_check_uptime_valid_url():
       response = client.post("/check", json={"url": "https://www.example.com"})
       assert response.status_code == 200
       assert isinstance(response.json(), list)

   def test_check_uptime_invalid_url():
       response = client.post("/check", json={"url": "not-a-valid-url"})
       assert response.status_code == 422  # Unprocessable Entity
   ```

3. **Run Tests:**

   ```bash
   pytest
   ```

---

## **12. Additional Enhancements**

Once the basic functionality is in place, consider adding the following features:

### **12.1. Interactive Maps**

Use libraries like [Leaflet](https://leafletjs.com/) or [Google Maps API](https://developers.google.com/maps) to visualize monitoring regions.

1. **Install Leaflet:**

   ```bash
   npm install leaflet react-leaflet
   ```

2. **Implement Map Component:**

   ```jsx
   // src/components/MapView.js
   import React from "react";
   import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
   import "leaflet/dist/leaflet.css";

   const regionCoordinates = {
     "us-east-1": [37.7749, -122.4194], // Example coordinates
     "eu-west-1": [51.5074, -0.1278],
     "ap-southeast-1": [1.3521, 103.8198],
     // Add more regions as needed
   };

   const MapView = ({ results }) => (
     <MapContainer
       center={[20, 0]}
       zoom={2}
       style={{ height: "400px", width: "100%" }}
     >
       <TileLayer
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         attribution="&copy; OpenStreetMap contributors"
       />
       {results.map((result) => (
         <Marker
           key={result.region}
           position={regionCoordinates[result.region]}
         >
           <Popup>
             <strong>{result.region}</strong>
             <br />
             Status: {result.status}
             <br />
             {result.responseTime !== null &&
               `Response Time: ${result.responseTime} ms`}
           </Popup>
         </Marker>
       ))}
     </MapContainer>
   );

   export default MapView;
   ```

3. **Integrate MapView in App:**

   ```jsx
   // src/App.js
   import MapView from "./components/MapView";

   // Inside the return statement
   {
     results && <MapView results={results} />;
   }
   ```

### **12.2. Historical Data and Trends**

Implement charts to show uptime trends over time.

1. **Install Recharts:**

   ```bash
   npm install recharts
   ```

2. **Create Trends Component:**

   ```jsx
   // src/components/Trends.js
   import React from "react";
   import {
     LineChart,
     Line,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     Legend,
   } from "recharts";

   const Trends = ({ historicalData }) => (
     <LineChart width={600} height={300} data={historicalData}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="timestamp" />
       <YAxis />
       <Tooltip />
       <Legend />
       <Line type="monotone" dataKey="responseTime" stroke="#8884d8" />
       <Line type="monotone" dataKey="status" stroke="#82ca9d" />
     </LineChart>
   );

   export default Trends;
   ```

3. **Fetch and Pass Historical Data:**

   Modify the backend to provide endpoints for fetching historical data and integrate it in the frontend.

### **12.3. User Authentication**

Allow users to create accounts and manage their monitored URLs.

1. **Implement Authentication:**

   - Use libraries like [FastAPI Users](https://fastapi-users.github.io/fastapi-users/) for backend.
   - Use [Firebase Authentication](https://firebase.google.com/docs/auth) or similar services.

2. **Secure API Endpoints:**

   - Protect endpoints with authentication tokens (e.g., JWT).

3. **Frontend Integration:**

   - Implement login and registration forms.
   - Store authentication tokens securely (e.g., HTTP-only cookies).

### **12.4. Notifications and Alerts**

Send real-time alerts when downtime is detected.

1. **Integrate Email Service:**

   - Use services like [SendGrid](https://sendgrid.com/) or [Mailgun](https://www.mailgun.com/).

2. **Implement Webhooks or Messaging Integrations:**

   - Connect to Slack, Discord, or Telegram for real-time notifications.

3. **Update Backend to Send Alerts:**

   Modify the backend to trigger alerts based on uptime results.

---

## **13. Conclusion**

Building a **Global Uptime Tracker** is a multifaceted project that covers essential aspects of full-stack development, including frontend interfaces, backend processing, serverless computing, and integration with cloud services. By following this guide, you will create a functional application that not only monitors website uptime from various regions but also provides a rich set of features and visualizations for users.

**Key Takeaways:**

- **Frontend with React:** Provides a dynamic and responsive user interface.
- **Backend with Python FastAPI:** Efficiently handles API requests and interacts with AWS Lambda functions.
- **AWS Lambda for Global Monitoring:** Leverages serverless architecture to perform uptime checks from multiple regions.
- **Optional Database Integration:** Enables historical data tracking and trend analysis.
- **Security and Cost Management:** Ensures the application is secure and operates within budget constraints.

**Next Steps:**

1. **Implement Optional Features:** Enhance your application with maps, historical trends, user authentication, and notifications.
2. **Optimize Performance:** Ensure efficient code and resource usage to maintain low costs.
3. **Scale as Needed:** If your project grows, consider upgrading services or optimizing architecture for higher scalability.
4. **Document Your Project:** Maintain clear documentation to showcase your work and facilitate future development.

**Resources:**

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Render.com Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [Recharts Documentation](https://recharts.org/en-US/)

**Good luck with your Global Uptime Tracker project!** If you encounter any challenges or need further assistance, feel free to reach out.

---

**Download This Guide:**

You can [download this guide as a PDF](#) _(Insert download link here)_ for offline reference.

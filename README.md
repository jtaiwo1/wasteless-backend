# WasteLess Backend

- Three Docker services: Express (public API)
- Python (dashboard analytics)
- PostgreSQL (pantry records).

### Problem Statement:
Households often have unopened or unused food sitting in cupboards that eventually expires and gets thrown away, while local charities and food banks may simultaneously need those same items. There is often no simple way for people to know what nearby organisations need or whether the food they already have could be donated.

### Solution Statement:
Our application helps users track surplus food in their home and matches those items with the current needs of local food banks and charities. Users can see where their food could be donated, prioritise items approaching expiry, and arrange a suitable donation before the food is wasted.

## Overview MVP

- Sign up and Login Screens
- Digital Pantry: Allowing users to manually add food or by scanning a receipt to fill their pantry.
- A dashboard that shows Users long term usage, wastage and donation data analytics.
- A Donation page where users can easily see nearby food banks or charities with matching food requirements to their pantry.

### MVP Wireframe
<img width="1403" height="560" alt="Screenshot 2026-10-01 at 16 31 59" src="https://github.com/user-attachments/assets/8824d785-6e2b-4573-b0dd-2cc27825b289" />

## Getting Started locally

### Installation Back end

1. Clone the repository
   
   - Inside your terminal: `git clone` and paste your SHH link.

2. Navigate to the project directory

    - `cd wastless-backend`

3. Install dependencies
   
   - When inside the root folder.
   - `npm i`
4. Copy `.env.example` to `.env` and choose your own database password.
   
5. Run `docker compose up -d --build`.
   
6. Visit `/health` on http://localhost.
   
7. Express communicates with Python using `http://wasteless-insights:8000`.
   
### Installation Front end

- Follow instructions in this repo.
- https://github.com/Rmorbey/wasteless-frontend/edit/main/README.md#wasteless

### Database Schema

```
CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(250) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE pantry (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES users(user_id),
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1
    CHECK (quantity > 0),
  expiry_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'donated', 'used', 'wasted')),
  status_update_date DATE
);
```

## API Endpoints

All available API endpoints with their methods and descriptions.

### Base URL
`http://localhost/` (or your deployed URL)

### API Endpoints

| Route | Method | Response |
| --- | --- | --- |
| `/users` | `GET` | Returns a JSON object of the users. |
| `/health` | `GET` | Returns a JSON object containing status ok. |
| `/pantry` | `GET` | Returns a JSON object representing the pantry via auth token for specific user. |
| `/pantry` | `POST` | Accepts a JSON object and uses it to create and store pantry items. |
| `/scan-receipt` | `POST` | Accepts an imageURL and sends it to Groq and qwen ai model to scan a receipt and calculate expiry date and then adds items to pantry table. |
| `/dashboard` | `GET` | Returns data analytics from python backend FastAPI via auth token for specific user. |

### Example Request

To retrieve all users, you can use the following GET request - `GET /`

Using your API testing platform of choice, such as Hoppscotch, Postman, Thunder or Insomnia to test the API.

Perform a GET request on: `http://localhost/users`

### Example Response

A successful response will return a JSON array of snack objects, similar to the following:
      
  ```json
  {
    "user_id": 1,
    "username": "russ@gmail.com",
    "password": "$2b$10$XIJ4YId6imxN1KtnDKWYTuMz0eK1/Ru5bSbK2sy/Z8xnLaup7T/Pi"
  },
  {
    "user_id": 2,
    "username": "ish@gmail.com",
    "password": "$2b$10$kZQueQZjQSSrITmfFCpRquS/ny5IPeshg3YkaGQj8FAS/pPH8Bjie"
  }
  ```

## Planning and Delivery

### Initial Project time management scope

#### 2 Week Project
2 Sprints

#### Realistically 7 Days of Coding.
Broken down into 4 hr AM and 3 hr PM chunks.

#### Week 1 Sprint 1
Friday 18th: Pitches / Business Case

Monday: AM: Start Coding / PM: Coding

Tuesday: AM: Coding / PM: Coding

Wednesday: AM: Coding / PM: Coding (Mid week mini retro)

Thursday: AM: Coding / PM: Coding

Friday: AM: Coding / PM: Team retro

#### Week 2 Sprint 2

Monday: AM: Coding / PM: Coding

Tuesday: AM: Coding / PM: Coding new Feature Freeze (Mid week mini retro)

Wednesday: AM: Bug fixing and Finalising Coding / PM: Coding Finished 

Thursday: AM: Presentation 1st Dry Run / PM: Implement Feedback

Friday: AM: Presentation 2nd Dry Run / PM: Real presentation 5th floor Stakeholders.

#### Daily Schedule

Morning AM:

9AM / 9:15AM: Group standup 10mins - 15mins

Rest of Morning Coding

12:30PM: Pre Lunch check in / code show and tell
Lunch 1PM

Afternoon PM:

2PM: Coding Sessions

4:30PM: End of day check in / code show and tell

End of day 5PM

### Stakeholder and Risk Analysis

<img width="456" height="444" alt="Screenshot 2026-10-01 at 16 44 14" src="https://github.com/user-attachments/assets/a3082f66-13d0-4b72-8536-3b810868f78c" />

<img width="829" height="443" alt="Screenshot 2026-10-01 at 16 44 24" src="https://github.com/user-attachments/assets/1be791a3-e43c-4393-b840-1e1ddd9cd7c2" />

### Kanban and User Stories

- As a shopper, I want to quickly scan item barcodes or upload receipts, so that my digital pantry updates automatically without manual typing.
- As a shopper, I want to receive alerts about expiring items that match nearby charity needs, so that I can donate them before they go to waste.
- As a shopper, I want to see a map or list of nearby organisations that need my excess food based on my postcode, so that i know exactly where my donations will make an impact.
- As a shopper, I want to easily log whether an item was used, donated or wasted, so that my dashboard metrics stay accurate.
- As a shopper, I want to view a dashboard showing my usage habits and the number of meals I’ve provided, so that I can feel motivated by my positive community impact.
- As a charity volunteer, I want donors to see our specific drop off guidelines, so that we only receive acceptable, safe and manageable food drop offs. (i.e. only dry goods, no fresh meat, drop off at the back of the church)
  
<img width="1400" height="574" alt="Screenshot 2026-10-01 at 16 44 50" src="https://github.com/user-attachments/assets/1c057c71-76fb-4d8b-944c-34c0145de2b0" />

## Test coverage

- We achieved around 93% line coverage averaged across the front and backend of the application, meaning the vast majority of executable lines were exercised by our automated tests.
- On the Back end a line coverage of 96%.

### Testing Tools:
- Jest (Unit and Service testing)
- React Native Testing Library (Screen and Interaction testing
- We focused on key user flows, API behaviour, error handling, state changes, and data-processing logic.

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/ea43a242-ffe6-40ea-975f-f660e3d414a9" />

## Future features

### Accessibility
- Making our app fully compatible for screen readers and other features.
- To ensure that people with visual, auditory and cognitive impairments can use the app.

### Improved Pantry
- Edit individual pantry items.
- Separate pantry screens.
- Receipt scanning using a persons phone camera.

### Improved Donations
- Enable peer-to-peer donations allowing you to donate to other users of the application as well as food banks.

### Digital receipts and supermarket integration
- Stepping away from physical receipts.
- Allowing users to input their digital receipts and supermarket app data.


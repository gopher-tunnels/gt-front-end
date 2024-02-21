# Gopher Tunnels Front-End
  Welcome to the Front End repository for Gopher Tunnels
## Dependencies
  * [NodeJS](https://nodejs.org/en)
  * [Git](https://git-scm.com/downloads)
  * [ExpressJS](https://expressjs.com/en/starter/installing.html)
## Key URLS For Reference
  * [React Native Documentation](https://reactnative.dev/docs/tutorial)
  * [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  * [RESTful API Guide](https://www.ibm.com/topics/rest-apis#:~:text=the%20next%20step-,What%20is%20a%20REST%20API%3F,representational%20state%20transfer%20architectural%20style)
  * [HTTP Requests Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  * [CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
  * [FlexBox Documentation... Yes this needs a separate bullet point](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)

## Core Technology Stack
| Technology | Description | Use |
| -- | -- | -- |
| [React Native](https://reactnative.dev/) | User Interface Framework | Runtime | 
| [TypeScript](https://www.typescriptlang.org/) | Language | Runtime | 
| [ExpressJS](https://expressjs.com/) | Core Framework | Runtime | 
| [MySQL](https://www.mysql.com/) | Storage | | 

## Setup
1. Install NodeJS and Git
  * First install NodeJS and Node Package Manager (npm)
  * Install the lastest version of Git, Links: [Windows]("https://git-scm.com/download/win"), [macOS]("https://git-scm.com/download/mac")
  * Log into Git inside your code editor (VSCode, VIM, etc.)

2. Navigate to your desired folder location and run the command to clone the repository into your local machine
```
git clone https://github.com/gopher-tunnels/gt-front-end.git
```
3. Then run the following command to install all dependencies:
```
npm install
```
4. Now git pull and check which branch you are on using the following command, it should show all branches with a * on main:
```
git pull
git branch
```
Example:
```
*main
branch2
branch3
branch4
```
5. Navigate to a branch other than main!
```
git switch placeholderBranch
git pull
```
6. Run the following command:
```
npx expo
```
You should see a QR code pop up along with a list of commands from Expo if you configured yourself correctly

7. Congratulations, your environment is setup!

# 📋 Todo List Project README 🚀

Welcome to the **Todo List** project! 🎉 This is a snappy, TypeScript-powered app built with **React** for the frontend and **Node.js** for the backend, letting you create, edit, and delete todos with a slick UI and smooth UX. 😎 Let's dive into the fun stuff!

---

## 🎯 What's This All About?

This project is a full-stack todo list application where you can:
- ✏️ **Add** todos with a title, description, and "done" status.
- 🖌️ **Edit** todos right in place with inline input fields.
- 🗑️ **Delete** todos with a single click.
- 🔔 Get **notifications** for success or errors using `react-toastify`.
- ⚡️ Enjoy a **TypeScript**-safe codebase with clean state management using `useReducer`.
- 🌟 See todos load with a fancy `Suspense` fallback and smooth updates with `useTransition`.

The backend stores todos in a `todos.json` file, keeping things simple yet functional. 📂

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, react-toastify, Axios
- **Backend**: Node.js, Express, TypeScript
- **State Management**: `useReducer` for clean, centralized state
- **Async Goodies**: `Suspense` for loading, `useTransition` for smooth UI updates
- **Storage**: JSON file (`todos.json`)

---

## 🚀 Getting Started

Ready to run this bad boy? Here's how to get it up and running! 🔥

### Prerequisites
- 🟢 **Node.js** (v16 or higher)
- 🟢 **npm** (comes with Node.js)
- 🟢 A passion for todos! 😈

### Installation
1. **Clone the repo**:
   ```bash
   git clone <your-repo-url>
   cd todo-list
   ```
# Install dependencies for both frontend and backend:bash
```
# In the root folder (for backend)
npm install

# In the frontend folder (if separate, e.g., /client)
cd client
npm install
```

# Running the ProjectBoth the backend and frontend run with a single command! Backend (Node.js/Express):bash
```
npm run dev
```
This starts the server on http://localhost:3000.
Frontend (React):bash
```
cd client
npm run dev
```
This spins up the React app, usually on http://localhost:3000 or another port if prompted.

Pro Tip: If you're using a monorepo or both are in the same folder, you might have a single npm run dev script that runs both! Check your package.json for details. 

# Features in ActionAdd a Todo: Fill in the title, description, and check "isDone" in the form, then hit Submit. 
### Edit a Todo: Click the  icon, edit inline, and save or cancel. Smooth as butter! 
### Delete a Todo: Click the  icon to nuke a todo from the list.
### Notifications: Success or error messages pop up at the bottom-center with react-toastify. 
### Loading State: Suspense shows a "Loading..." fallback while fetching todos. 
### Smooth Updates: useTransition keeps the UI responsive during heavy updates. 

# Backend API RoutesThe backend is powered by Express and handles todos in todos.json. Here are the routes:GET /all-todos: Fetches all todos.
POST /write-todo: Adds a new todo (requires title, desc, isClicked).
PUT /edit-todo?Title=<title>: Updates a todo by its title.
DELETE /delete-todo?Title=<title>: Deletes a todo by its title.

Note: The todos.json file is your "database" and looks like this:
```json
[
  {
    "title": "Learn Rust",
    "desc": "Gotta master Actix-Web and Slint! 😈",
    "isClicked": false
  }
]
```

#  TroubleshootingToastify acting weird? Make sure you have only one <ToastContainer /> in your app. Check for duplicate imports or renders.
#### TypeScript errors? Double-check types in EditIcon.tsx (onEdit: () => void) and other components.
#### Backend not saving correctly? Ensure todos.json is writable and in the correct format (no extra quotes or slashes).
#### Still stuck? Ping me with the error, and I'll sort it out! 







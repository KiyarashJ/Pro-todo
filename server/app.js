const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders: ['X-Metadata' , 'filename' , 'Content-Type'],

}))

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))


app.post("/write-todo", (req, res) => {
    try {
        
        const data = req.body;
        console.log("datas when are came back-end: ", data);
        let file_read;
        let new_data;
        if(fs.existsSync("todos.json")) {
            file_read = fs.readFileSync(path.join(__dirname, "todos.json"), "utf8");
            file_read = JSON.parse(file_read)
            new_data = [data, ...file_read];
        } else {
            new_data = [data];
        }
        const file = fs.writeFile(path.join(__dirname, "todos.json"), JSON.stringify(new_data, null, 2) , (err) => {
            if (err) {
                console.log("file not written !!!");
            } else {
                console.log("file written successfully !!!")
            }
        })
        return res.json({msg: "that was successful"});

    } catch (error) {
        console.log("\x1b[34man Error occured: \x1b[0m", error);
        return res.status(500).json({msg: "\x1b[34man Error occured: \x1b[0m"})
    }
})

app.get("/all-todos", (req, res) => {
    try {
        if (!fs.existsSync("todos.json")) return res.json({msg: "no todos !"})
        const get_all_todos = JSON.parse(fs.readFileSync(path.join(__dirname, "todos.json"), "utf8"));
        if (typeof get_all_todos == "object" && get_all_todos[0] == undefined) return res.json({msg: "no todos !"})
        return res.json(get_all_todos);
    } catch (error) {
        console.log("\x1b[34man Error occured: \x1b[0m", error);
        return res.status(500).json({msg: "\x1b[34man Error occured: \x1b[0m"})
    }
})

app.delete("/delete-todo", (req, res) => {
    try {
        const { title } = req.query;
        const get_all_todos = fs.readFileSync(path.join(__dirname, "todos.json"), "utf8")
        const deleteTodo = JSON.parse(get_all_todos).filter(todo => todo.title !== title)
        const write = fs.writeFile(path.join(__dirname, "todos.json"), JSON.stringify(deleteTodo, null, 2), err => {
            if (err) console.log("An Error occured while write delete todo")
        })
        return res.status(200).json({msg: "successfully deleted todo !"})
    } catch (error) {
        console.log("\x1b[34man Error occured while deleting Todo\x1b[0m", error);
        return res.status(500).json({msg: "\x1b[34man Error occured while deleting Todo\x1b[0m"}) 
    }
})

app.put("/edit-todo", (req, res) => {
  try {
    const { Title } = req.query; 
    const { title, desc, isClicked } = req.body; 

    const filePath = path.join(__dirname, "todos.json");
    const todos = JSON.parse(fs.readFileSync(filePath, "utf8"));

    
    const updatedTodos = todos.map(todo => {
      if (todo.title === Title) {
        return {
          ...todo,
          title: title ?? todo.title,
          desc: desc ?? todo.desc,
          isClicked: isClicked ?? todo.isClicked
        };
      }
      return todo;
    });

    fs.writeFile(filePath, JSON.stringify(updatedTodos, null, 2), err => {
      if (err) {
        console.log("Error while writing updated todos", err);
        return res.status(500).json({ msg: "Failed to update todo" });
      }

      return res.status(200).json({ msg: "Edit was successful!" });
    });

  } catch (error) {
    console.log("\x1b[31mAn Error occurred while editing todo\x1b[0m", error);
    return res.status(500).json({ msg: "An error occurred while editing todo" });
  }
});



app.listen(3000, () => {
    console.log("\x1b[32mServer is running on port 3000 \x1b[0m");
})
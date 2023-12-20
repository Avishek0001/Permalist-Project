import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host: "localhost",
  database: "permalist",
  password: "avishek",
  port: 5432,
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try{

    const result = await db.query("Select * from items Order by id asc");
    const items = result.rows
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("Insert Into items (title) Values ($1)",[item])
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
 
});

app.post("/edit",async (req, res) => {
  const update_item = req.body.updatedItemTitle;
  const update_id = req.body.updatedItemId;

  try{
    await db.query("Update items Set title = ($1) where id = $2",[update_item,update_id])
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

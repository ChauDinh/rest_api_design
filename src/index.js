const express = require("express");
const { userService } = require("./services/");
const catchException = require("./middlewares/catchException");
const ErrorWithStatusCode = require("./errors/ErrorWithStatusCode");
const app = express();

app.use(express.json());

app.get(
 "/api/v1/users",
 catchException(async (req, res) => {
  let { offset, limit, fields } = req.query;
  offset = parseInt(offset);
  limit = parseInt(limit);
  limit = Math.min(limit, 50);
  fields = fields ? fields.split(",") : undefined;
  const users = await userService.listUsers(offset, limit, fields);
  res.json(users);
 })
);

app.post(
 "/api/v1/users/:userId",
 catchException(async (req, res) => {
  const { command } = req.body;

  switch (command) {
   case "send-email": 
    return res.json({ message: "Email sent!" });

   default: 
    return res.json({ message: `${command} is not a valid command` });
  }
 })
); 

app.get(
  "/api/v1/users/:userId",
  catchException(async (req, res) => {
    const { userId } = req.params;
    let { fields } = req.query;
    fields = fields ? fields.split(",") : undefined;
    const user = await userService.getUser(userId, fields);
    res.json(user);
  })
)

app.post(
 "/api/v1/users",
 catchException(async (req, res) => {
  const { firstName, lastName } = req.body;
  const user = userService.createUser(firstName, lastName);
  res.json(user);
 })
);

app.post(
  "/api/v1/users/:userId/send-email",
  catchException(async (req, res) => {
    res.json({ message: "Email sent!" });
  })
);

app.put(
  "/api/v1/users/:userId",
  catchException(async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName } = req.body;
    const user = await userService.updateUser(userId, firstName, lastName);
    res.json(user);
  })
);

app.delete(
 "/api/v1/users/:userId",
 catchException(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.deleteUser(userId);
  res.json(user);
 })
);

app.use((error, req, res, next) => {
 console.log(error.message);
 res.status(error.statusCode || 500).json({ message: error.message });
});

module.exports = app;
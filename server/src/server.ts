import express from "express";
import { faker } from "@faker-js/faker";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3005;
const leadStatus = ["expired", "in contact", "lost", "won"]

app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/leads", (req, res) => {
    console.log("hit leads");
    let count = parseInt(req.query.n as string) || 10;
    let data = Array(count).fill({}).map((_, i) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        mobile: faker.phone.number(),
        status: leadStatus[Math.floor(Math.random() * leadStatus.length)],
    }));
    res.json(data);
});

app.post('/leads', (req, res) => {
    console.log(req.body);  // Log the received JSON data
    setTimeout(() => {
        res.status(200).send('Lead received');
    }, 3000)
});

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});

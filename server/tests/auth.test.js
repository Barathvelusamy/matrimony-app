require("dotenv").config({ quiet: true });
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/User");

jest.setTimeout(30000);

const testUri = process.env.MONGO_URI.replace("/matrimony?", "/matrimony_test?");

beforeAll(async () => {
  if (testUri === process.env.MONGO_URI) {
    throw new Error("Could not build test database URI. Check MONGO_URI.");
  }
  await mongoose.connect(testUri);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  const user = { name: "Test User", email: "test@example.com", password: "test1234" };

  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registered successfully");
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already registered");
  });

  it("rejects registration with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "x@example.com" });
    expect(res.statusCode).toBe(400);
  });

  it("logs in with correct credentials and returns a token", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with a wrong password", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrongpass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("blocks /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  it("returns the user on /me with a valid token", async () => {
    await request(app).post("/api/auth/register").send(user);
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: user.password });
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${login.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });
});
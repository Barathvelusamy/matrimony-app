require("dotenv").config({ quiet: true });
const request = require("supertest");
const bcrypt = require("bcryptjs");
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
  await User.syncIndexes();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

const person = { name: "Test User", username: "testuser", password: "secret123" };
const register = (body = person) => request(app).post("/api/auth/register").send(body);
const login = (body) => request(app).post("/api/auth/login").send(body);

describe("Auth API (username and password)", () => {
  it("registers and returns a token", async () => {
    const res = await register();
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe("testuser");
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects an invalid username", async () => {
    const res = await register({ ...person, username: "a b" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects a short password", async () => {
    const res = await register({ ...person, password: "123" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects a missing name", async () => {
    const res = await register({ username: "someone", password: "secret123" });
    expect(res.statusCode).toBe(400);
  });

  it("rejects a duplicate username, ignoring case", async () => {
    await register();
    const res = await register({ ...person, username: "TestUser" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Username already taken");
  });

  it("allows two users without an email", async () => {
    await register();
    const res = await register({ name: "Second", username: "seconduser", password: "secret123" });
    expect(res.statusCode).toBe(201);
  });

  it("logs in with username and password", async () => {
    await register();
    const res = await login({ username: "testuser", password: "secret123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("logs in with an old email account", async () => {
    await User.create({
      name: "Old",
      username: "olduser",
      email: "old@example.com",
      password: await bcrypt.hash("secret123", 10),
    });
    const res = await login({ username: "old@example.com", password: "secret123" });
    expect(res.statusCode).toBe(200);
  });

  it("rejects a wrong password", async () => {
    await register();
    const res = await login({ username: "testuser", password: "wrongpass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("rejects an unknown username", async () => {
    const res = await login({ username: "nobody", password: "secret123" });
    expect(res.statusCode).toBe(400);
  });

  it("blocks /me without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });

  it("returns the user on /me with a valid token", async () => {
    const reg = await register();
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${reg.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("testuser");
    expect(res.body.password).toBeUndefined();
  });
});
const { nanoid } = require('nanoid')

function createUser({ email, name }) {
  return { id: nanoid(), email, name, createdAt: new Date().toISOString() }
}

function createAuthUser({ email, name, passwordHash }) {
  return { id: nanoid(), email, name, passwordHash, createdAt: new Date().toISOString() }
}

function createProfile({ userId, fullName, contact, experiences = [], education = [], skills = [], projects = [], certifications = [], languages = [], evidence = [] }) {
  return {
    id: nanoid(),
    userId,
    fullName,
    contact,
    experiences,
    education,
    skills,
    projects,
    certifications,
    languages,
    evidence,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

module.exports = { createUser, createAuthUser, createProfile }

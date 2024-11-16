const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const maerr = require("../Utils/Error.js");
const Agent = require("../Models/Agent.model.js");

const uri = "mongodb://localhost:27017/abuildhomesDB";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const AgentCollection = client.db("abuildhomesDB").collection("Agents");

const createToken = (agent) => {
  const payload = {
    agentId: agent._id,
    fullName: agent.fullName,
    role: agent.role,
    RERANumber: agent.RERANumber,
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

const AgentPost = async (req, res, next) => {
  const {
    fullName,
    contactInfo: { phone, email, address },
    RERANumber,
    experienceLevel,
    specialization,
    licensesAndCertifications,
    IDProof,
    addressProof,
    role,
    password,
  } = req.body;

  try {
    const newAgent = new Agent({
      fullName,
      contactInfo: { phone, email, address },
      RERANumber,
      experienceLevel,
      specialization,
      licensesAndCertifications,
      IDProof,
      addressProof,
      role: role || "Agent",
      verified: false,
      password,
    });

    await newAgent.validate();

    const insertedAgent = await AgentCollection.insertOne({
      fullName,
      contactInfo: { phone, email, address },
      RERANumber,
      experienceLevel,
      specialization,
      licensesAndCertifications,
      IDProof,
      addressProof,
      role: role || "Agent",
      verified: false,
      password,
    });

    // Generate JWT Token after agent is successfully added
    const token = createToken(insertedAgent);

    return res.status(201).json({ 
      message: "Agent added successfully", 
      agent: insertedAgent, 
      token: token // Send JWT token to client
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// Get Agent(s) (GET)
const AgentGet = async (req, res, next) => {
  try {
    const agents = await AgentCollection.find().toArray();
    return res.json(agents);
  } catch (error) {
    next(error);
  }
};

// Update Agent (PUT)
const AgentPut = async (req, res, next) => {
  const { RERANumber } = req.body;
  const {
    fullName,
    contactInfo: { phone, email, address },
    experienceLevel,
    specialization,
    licensesAndCertifications,
    IDProof,
    addressProof,
    verified,
    role,
  } = req.body;

  try {
    const updatedAgent = await AgentCollection.findOneAndUpdate(
      { RERANumber },
      {
        $set: {
          fullName,
          contactInfo: { phone, email, address },
          experienceLevel,
          specialization,
          licensesAndCertifications,
          IDProof,
          addressProof,
          verified,
          role,
        },
      },
      { new: true }
    );

    if (!updatedAgent.value) {
      return res.status(404).json({ message: "Agent not found" });
    }

    return res.status(200).json({ message: "Agent updated successfully", updatedAgent: updatedAgent.value });
  } catch (error) {
    next(error);
  }
};

// Delete Agent (DELETE)
const AgentDelete = async (req, res, next) => {
  const { RERANumber } = req.body;

  try {
    const deletedAgent = await AgentCollection.deleteOne({ RERANumber });

    if (deletedAgent.deletedCount === 0) {
      return res.status(404).json({ message: "Agent not found" });
    }

    return res.status(200).json({ message: "Agent deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AgentPost,
  AgentGet,
  AgentPut,
  AgentDelete,
};

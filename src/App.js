import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import "./App.css";

// Contract ABI and Address (update with your own contract's details)
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_dueDate",
        type: "uint256",
      },
    ],
    name: "addAssignment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAssignments",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "dueDate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isDone",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDueDateChanged",
            type: "bool",
          },
        ],
        internalType: "struct TaskManager.Assignment[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_assignmentIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isDone",
        type: "bool",
      },
    ],
    name: "markAssignmentDone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_assignmentIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newDueDate",
        type: "uint256",
      },
    ],
    name: "modifyDueDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddress = "0x376cD9D1B21E3aea4Cb9CD5A85BBfD9bab3FB6D0";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Provider = new BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      const userSigner = await web3Provider.getSigner();
      setSigner(userSigner);
      const userAddress = await userSigner.getAddress();
      setAccount(userAddress);

      const taskContract = new Contract(
        contractAddress,
        contractABI,
        userSigner
      );
      setContract(taskContract);
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    if (contract) {
      const tasks = await contract.getAssignments();
      setAssignments(tasks);
    }
  };

  // Add a new assignment
  const addAssignment = async () => {
    if (contract && description && dueDate) {
      try {
        const tx = await contract.addAssignment(description, parseInt(dueDate));
        await tx.wait();
        fetchAssignments(); // Refresh the list after adding
      } catch (err) {
        console.error("Failed to add assignment:", err);
      }
    }
  };

  // Mark an assignment as done
  const markDone = async (index) => {
    if (contract) {
      try {
        const tx = await contract.markAssignmentDone(index, true);
        await tx.wait();
        fetchAssignments(); // Refresh the list after updating
      } catch (err) {
        console.error("Failed to mark assignment as done:", err);
      }
    }
  };

  useEffect(() => {
    if (contract) {
      fetchAssignments();
    }
  }, [contract]);

  return (
    <div className="App">
      <h1>TaskManager</h1>
      {account ? (
        <>
          <div>
            <h3>Add New Assignment</h3>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Due Date (as timestamp)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={addAssignment}>Add Assignment</button>
          </div>

          <div>
            <h3>Your Assignments</h3>
            <ul>
              {assignments.map((assignment, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: assignment.isDone ? "lightgreen" : "white",
                  }}
                >
                  <p>{assignment.description}</p>
                  <p>Due: {Number(assignment.dueDate)}</p>
                  <p>Status: {assignment.isDone ? "Completed" : "Pending"}</p>
                  {!assignment.isDone && (
                    <button onClick={() => markDone(index)}>
                      Mark as Done
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default App;

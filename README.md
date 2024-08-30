# TaskManager Smart Contract

This Solidity program is a simple TaskManager contract that demonstrates the basic syntax and functionality of the Solidity programming language. The purpose of this program is to serve as a starting point for those who are new to Solidity and want to get a feel for how it works.

## Description

This program is a basic TaskManager contract written in Solidity, a programming language used for developing smart contracts on the Ethereum blockchain. The contract includes functionalities such as addAssignment, getAssignments , etc. This program serves as a simple and straightforward introduction to Solidity programming and can be used as a stepping stone for more complex projects in the future.

In this smart contract we also implements the require(), assert() and revert() statements.

We are also going to use react and web3 to connect our blockchain to frontend.


## Usage/Examples

```solidity

// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract TaskManager {

    struct Assignment {
        string description; // details of the assignment
        uint dueDate; // assignment deadline
        bool isDone; // completion status
        bool isDueDateChanged; // flag for due date modification
    }

    mapping(address => Assignment[]) private assignmentsByUser;

    function addAssignment(string memory _description, uint _dueDate) public {
        if (bytes(_description).length == 0) {
            revert("Assignment description cannot be empty");
        }

        assignmentsByUser[msg.sender].push(Assignment({
            description: _description,
            dueDate: _dueDate,
            isDone: false,
            isDueDateChanged: false
        }));
    }

    function markAssignmentDone(uint _assignmentIndex, bool _isDone) public {
        assert(_assignmentIndex < assignmentsByUser[msg.sender].length);
        assignmentsByUser[msg.sender][_assignmentIndex].isDone = _isDone;
    }

    function modifyDueDate(uint _assignmentIndex, uint _newDueDate) public {
        require(_assignmentIndex < assignmentsByUser[msg.sender].length, "Invalid assignment index");
        require(!assignmentsByUser[msg.sender][_assignmentIndex].isDueDateChanged, "Due date can only be modified once");
        assignmentsByUser[msg.sender][_assignmentIndex].dueDate = _newDueDate;
        assignmentsByUser[msg.sender][_assignmentIndex].isDueDateChanged = true;
    }

    function getAssignments() public view returns (Assignment[] memory) {
        return assignmentsByUser[msg.sender];
    }
}


```


## Run Locally

Clone the project

```bash
  git clone https://github.com/Abhishekanand32/taskManager-frontend.git
```

Go to the project directory

```bash
  cd taskManager-frontend
```

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start frontend 
```bash
  npm start
```
## Screenshots

![App Screenshot](https://res.cloudinary.com/dsprifizw/image/upload/v1724598005/Screenshot_2024-08-25_202951_lqfqd0.png)

![App Screenshot](https://res.cloudinary.com/dsprifizw/image/upload/v1724598006/Screenshot_2024-08-25_202942_cqhvcu.png)






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
        if (bytes(_description).length <= 5) {
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

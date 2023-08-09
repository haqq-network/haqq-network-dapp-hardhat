// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ZakatToken is ERC20, ERC20Permit, Ownable {
    uint256 public zakatPercentage = 25;  // This represents 2.5% (as before, we'll divide by 1000 later).

    // Default zakatAddress for users who haven't set their own
    address public defaultZakatAddress;
    mapping(address => address) private userZakatRecipients;

    constructor(string memory name, string memory symbol, address _defaultZakatAddress)
    ERC20(name, symbol) ERC20Permit(name)
    {
        require(_defaultZakatAddress != address(0), "Zakat address cannot be the zero address.");
        defaultZakatAddress = _defaultZakatAddress;
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 zakatAmount = calculateZakat(amount);
        uint256 transferAmount = amount - zakatAmount;

        address zakatRecipient = getUserZakatRecipient(msg.sender);
        super.transfer(zakatRecipient, zakatAmount);
        return super.transfer(recipient, transferAmount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 zakatAmount = calculateZakat(amount);
        uint256 transferAmount = amount - zakatAmount;

        address zakatRecipient = getUserZakatRecipient(sender);
        super.transferFrom(sender, zakatRecipient, zakatAmount);
        return super.transferFrom(sender, recipient, transferAmount);
    }

    function calculateZakat(uint256 _amount) public view returns (uint256) {
        return (_amount * zakatPercentage) / 1000;  // 2.5% of the amount
    }

    // User-specific Zakat recipient functions
    function setUserZakatRecipient(address _zakatRecipient) public {
        require(_zakatRecipient != address(0), "Zakat recipient cannot be the zero address.");
        userZakatRecipients[msg.sender] = _zakatRecipient;
    }

    function getUserZakatRecipient(address _user) public view returns (address) {
        address recipient = userZakatRecipients[_user];
        if (recipient == address(0)) {
            return defaultZakatAddress;
        }
        return recipient;
    }

    // Functions for the owner to modify defaults
    function setDefaultZakatAddress(address _newDefaultZakatAddress) public onlyOwner {
        require(_newDefaultZakatAddress != address(0), "Default Zakat address cannot be the zero address.");
        defaultZakatAddress = _newDefaultZakatAddress;
    }

    function setZakatPercentage(uint256 _newPercentage) public onlyOwner {
        require(_newPercentage <= 1000, "Percentage cannot be more than 100%.");
        zakatPercentage = _newPercentage;
    }
}

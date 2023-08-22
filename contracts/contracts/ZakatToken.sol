// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title ZakatToken - A token contract that supports zakat (charity) distribution
/// @notice This contract implements a token with an optional zakat (charity) distribution feature.
/// Users can send transactions with a portion of the amount being automatically sent to a zakat recipient.
contract ZakatToken is ERC20, ERC20Permit, Ownable {
    // Constants
    uint256 private constant PERCENTAGE_DENOMINATOR = 1000; // Denominator for percentage calculation

    // State variables
    uint256 public zakatPercentage = 25; // Represents 2.5% (as before, divided by 1000 later)
    uint256 public distributedZakat; // Total tokens distributed as zakat

    // Default zakat address for users who haven't set their own
    address public defaultZakatAddress;
    mapping(address => address) private userZakatRecipients;

    // zakat distribution per user
    mapping(address => uint) private zakatDistributionPerUser;

    /// @dev Initializes the contract with the provided token name, symbol, and default zakat address.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param _defaultZakatAddress The default zakat recipient address.
    constructor(string memory name, string memory symbol, address _defaultZakatAddress)
    ERC20(name, symbol)
    ERC20Permit(name)
    {
        require(_defaultZakatAddress != address(0), "Zakat address cannot be the zero address.");
        defaultZakatAddress = _defaultZakatAddress;

        // Mint initial tokens to the contract creator
        _mint(msg.sender, 1000 ether);
    }

    /// @dev Transfers tokens to the specified recipient, distributing zakat if applicable.
    /// @param recipient The address to receive the tokens.
    /// @param amount The amount of tokens to transfer.
    /// @return A boolean indicating the success of the transfer.
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 zakatAmount = calculateZakat(amount);
        uint256 transferAmount = amount - zakatAmount;

        address zakatRecipient = getUserZakatRecipient(msg.sender);
        super.transfer(zakatRecipient, zakatAmount);
        distributedZakat += zakatAmount;

        // TODO: track zakat distribution per user

        return super.transfer(recipient, transferAmount);
    }

    /// @dev Transfers tokens from the sender to the recipient, distributing zakat if applicable.
    /// @param sender The address from which the tokens are sent.
    /// @param recipient The address to receive the tokens.
    /// @param amount The amount of tokens to transfer.
    /// @return A boolean indicating the success of the transfer.
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 zakatAmount = calculateZakat(amount);
        uint256 transferAmount = amount - zakatAmount;

        address zakatRecipient = getUserZakatRecipient(sender);
        super.transferFrom(sender, zakatRecipient, zakatAmount);
        distributedZakat += zakatAmount;

        // TODO: track zakat distribution per user

        return super.transferFrom(sender, recipient, transferAmount);
    }

    /// @dev Calculates the zakat amount for a given token transfer amount.
    /// @param _amount The token transfer amount.
    /// @return The calculated zakat amount.
    function calculateZakat(uint256 _amount) public view returns (uint256) {
        return (_amount * zakatPercentage) / PERCENTAGE_DENOMINATOR; // Calculate 2.5% of the amount
    }

    /// @dev Sets the zakat recipient address for the calling user.
    /// @param _zakatRecipient The new zakat recipient address.
    function setUserZakatRecipient(address _zakatRecipient) public {
        require(_zakatRecipient != address(0), "Zakat recipient cannot be the zero address.");
        userZakatRecipients[msg.sender] = _zakatRecipient;
    }

    /// @dev Retrieves the zakat recipient address for a given user.
    /// @param _user The user's address.
    /// @return The zakat recipient address.
    function getUserZakatRecipient(address _user) public view returns (address) {
        address recipient = userZakatRecipients[_user];
        return (recipient != address(0)) ? recipient : defaultZakatAddress;
    }

    /// @dev Sets the default zakat recipient address.
    /// @param _newDefaultZakatAddress The new default zakat recipient address.
    function setDefaultZakatAddress(address _newDefaultZakatAddress) public onlyOwner {
        require(_newDefaultZakatAddress != address(0), "Default Zakat address cannot be the zero address.");
        defaultZakatAddress = _newDefaultZakatAddress;
    }

    /// @dev Sets the new zakat percentage.
    /// @param _newPercentage The new zakat percentage value.
    function setZakatPercentage(uint256 _newPercentage) public onlyOwner {
        require(_newPercentage <= PERCENTAGE_DENOMINATOR, "Percentage cannot be more than 100%.");
        zakatPercentage = _newPercentage;
    }

}

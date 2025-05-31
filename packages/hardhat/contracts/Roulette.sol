// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Roulette {
    struct Site {
        uint256 id;
        string url;
        bool isActive;
    }
    
    Site[] public sites;
    mapping(string => bool) public urlExists;
    mapping(address => uint256) public lastSpinTime;
    mapping(address => uint256[]) public userSpins;
    mapping(address => mapping(uint256 => bool)) public hasSpun;
    
    uint256 public constant SPIN_COOLDOWN = 10 seconds; // Для демо на хакатоне
    
    event SiteAdded(uint256 id, string url);
    event SiteSpinned(uint256 siteId, string url);
    
    constructor() {
        // Начальные сайты для демонстрации
        addSite("https://ethereum.org");
        addSite("https://github.com");
        addSite("https://stackoverflow.com");
        addSite("https://flow.com");
        addSite("https://scaffold-eth.io");
        addSite("https://ethglobal.com");
    }
    
    function addSite(string memory _url) public {
        require(bytes(_url).length > 0, "URL cannot be empty");
        require(!urlExists[_url], "URL already exists");
        
        uint256 newId = sites.length;
        sites.push(Site(newId, _url, true));
        urlExists[_url] = true;
        
        emit SiteAdded(newId, _url);
    }
    
    function spin() public returns (uint256) {
        require(sites.length > 0, "No sites available");
        require(
            block.timestamp >= lastSpinTime[msg.sender] + SPIN_COOLDOWN,
            "Cooldown period not finished"
        );
        
        uint256[] memory availableSites = new uint256[](sites.length);
        uint256 availableCount = 0;
        
        for (uint256 i = 0; i < sites.length; i++) {
            if (sites[i].isActive && !hasSpun[msg.sender][i]) {
                availableSites[availableCount] = i;
                availableCount++;
            }
        }
        
        require(availableCount > 0, "No new sites available for this user");
        
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    sites.length
                )
            )
        ) % availableCount;
        
        uint256 selectedSiteId = availableSites[randomIndex];
        
        lastSpinTime[msg.sender] = block.timestamp;
        userSpins[msg.sender].push(selectedSiteId);
        hasSpun[msg.sender][selectedSiteId] = true;
        
        emit SiteSpinned(selectedSiteId, sites[selectedSiteId].url);
        
        return selectedSiteId;
    }
    
    function getSitesCount() public view returns (uint256) {
        return sites.length;
    }
    
    function getSite(uint256 _id) public view returns (string memory) {
        require(_id < sites.length, "Site does not exist");
        return sites[_id].url;
    }
    
    function getUserSpins(address _user) public view returns (uint256[] memory) {
        return userSpins[_user];
    }
    
    function hasUserSpunSite(address _user, uint256 _siteId) public view returns (bool) {
        return hasSpun[_user][_siteId];
    }
    
    function getTimeUntilNextSpin(address _user) public view returns (uint256) {
        uint256 nextSpinTime = lastSpinTime[_user] + SPIN_COOLDOWN;
        if (block.timestamp >= nextSpinTime) {
            return 0;
        }
        return nextSpinTime - block.timestamp;
    }
}

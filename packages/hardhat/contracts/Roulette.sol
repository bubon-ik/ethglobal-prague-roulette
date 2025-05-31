// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Roulette {
    struct Site {
        uint256 id;
        string url;
        bool isActive;
    }

    Site[] public sites;
    mapping(address => uint256[]) public userSpins;
    mapping(string => bool) public urlExists; // Для исключения дубликатов
    mapping(address => mapping(uint256 => bool)) public hasSpun; // Для исключения повторений
    mapping(address => uint256) public lastSpinTime; // Время последнего спина

    uint256 public constant SPIN_COOLDOWN = 12 hours; // Ограничение в 12 часов

    event SiteAdded(uint256 id, string url);
    event SiteSpinned(uint256 siteId, string url);

    constructor() {}

    function addSite(string memory _url) public {
        require(!urlExists[_url], "Site already exists");
        sites.push(Site(sites.length, _url, true));
        urlExists[_url] = true;
        emit SiteAdded(sites.length - 1, _url);
    }

    function spin() public returns (uint256) {
        // Проверка времени последнего спина
        require(block.timestamp >= lastSpinTime[msg.sender] + SPIN_COOLDOWN, "You can only spin once every 12 hours");
        require(sites.length > 0, "No sites available");

        // Подсчитываем доступные сайты, которые пользователь еще не получил
        uint256 availableCount = 0;
        for (uint256 i = 0; i < sites.length; i++) {
            if (sites[i].isActive && !hasSpun[msg.sender][i]) {
                availableCount++;
            }
        }
        require(availableCount > 0, "No new sites available for this user");

        // Выбираем случайный сайт из доступных
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % availableCount;
        uint256 selectedId = 0;
        for (uint256 i = 0; i < sites.length; i++) {
            if (sites[i].isActive && !hasSpun[msg.sender][i]) {
                if (randomIndex == 0) {
                    selectedId = i;
                    break;
                }
                randomIndex--;
            }
        }

        // Обновляем время спина
        lastSpinTime[msg.sender] = block.timestamp;
        userSpins[msg.sender].push(selectedId);
        hasSpun[msg.sender][selectedId] = true;
        emit SiteSpinned(selectedId, sites[selectedId].url);
        return selectedId;
    }

    function getSitesCount() public view returns (uint256) {
        return sites.length;
    }

    function getSite(uint256 _id) public view returns (string memory) {
        require(_id < sites.length, "Invalid site ID");
        return sites[_id].url;
    }

    function getUserSpins(address _user) public view returns (uint256[] memory) {
        return userSpins[_user];
    }

    function hasUserSpunSite(address _user, uint256 _siteId) public view returns (bool) {
        return hasSpun[_user][_siteId];
    }

    function getTimeUntilNextSpin(address _user) public view returns (uint256) {
        if (block.timestamp >= lastSpinTime[_user] + SPIN_COOLDOWN) {
            return 0;
        }
        return (lastSpinTime[_user] + SPIN_COOLDOWN) - block.timestamp;
    }
}
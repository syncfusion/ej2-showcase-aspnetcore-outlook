var window;
var grpListObj;
var messageDataSource = null;
var dlgSentMail;
var dlgSentMailNew;
var dlgDiscard;
var dlgDiscardNew;
var dlgNewWindow;
var dlgReplyAllWindow;
var dlgFavorite;
var ddlReplyAll;
var dlgDelete;
var dropdownSelect = false;
var acrdnObj = new ej.navigations.Accordion();
var treeObj = new ej.navigations.TreeView();
var toolbarHeader = new ej.navigations.Toolbar();
var toolbarMobile;
var treeContextMenu;
var filterContextMenu;
var selectedListElement = null;
var acSearchMobile;
var popup1;
var treeviewSelectedData = null;
var treeSelectedElement = null;
var selectedFolderName = '';
var treeDataSource = [];
var isMenuClick = false;
var isItemClick = false;
var lastIndex = 31;
var hoverOnPopup = false;
var defaultSidebar;
window.home = function () {
    var contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    contentWrapper.onclick = hideSideBar;
    var overlayElement = document.getElementsByClassName('overlay-element')[0];
    overlayElement.onclick = hideSideBar;
    window.onresize = onWindowResize;
    // window.onload = onWindowResize;
    document.onclick = documentClick;
    document.ondblclick = documentDoubleClick;
    renderMainSection();
    renderToolbarMobile();
    renderSearchSection();
    createHeader();
    updateLoginDetails();
    renderFilterContextMenu();
    renderMailDialogs();
    treeObj.selectedNodes = ['8'];
    var popupContent = document.getElementById('popupContent');
    popupContent.onclick = popupContentClick;
    var ajaxHTML = new ej.base.Ajax('Home/Newmail', 'GET', true);
    ajaxHTML.send().then(function (value) {
        document.getElementById('newmailContent').innerHTML = value.toString();
        renderControl("newmailContent");
        window.newmail();
        document.getElementById('btnSend').onclick = sendClick;
        document.getElementById('btnDiscard').onclick = discardButtonClick;
    });
    ajaxHTML = new ej.base.Ajax('Home/Readingpane', 'GET', true);
    ajaxHTML.send().then(function (value) {
        document.getElementById('reading-pane-popup').innerHTML = value.toString();
        renderControl("reading-pane-popup");
        window.readingpane();
    });
    onWindowResize();
    setTimeout(openPopup, 2000);
};
function renderMainSection() {
    treeDataSource = folderData;
    treeObj = new ej.navigations.TreeView({
        fields: { dataSource: treeDataSource, id: 'ID', text: 'Name', parentID: 'PID', hasChildren: 'HasChild', expanded: 'Expanded' },
        nodeTemplate: '<div class="treeviewdiv">' +
        '<div style="float:left">' +
        '<span class="treeName">${Name}</span>' +
        '</div>' +
        '<div class="count" style="margin-left: 5px; float:right">' +
        '<span class="treeCount ${Name}" >${Count}</span>' +
        '</div>' +
        '<button title="${FavoriteMessage}" class="treeview-btn-temp">' +
        '<span class="e-btn-icon ej-icon-${Favorite} ${Name}"></span>' +
        '</button>' +
        '</div>',
        nodeSelected: nodeSelected,
    });

    defaultSidebar = new ej.navigations.Sidebar(
        {
            mediaQuery:  window.matchMedia('(min-width: 1090px)')
        }
    );
    defaultSidebar.appendTo('#default-sidebar');

    treeObj.appendTo('#tree');
    messageDataSource = messageDataSourceNew;
    messageDataSource = sortList(messageDataSource);
    grpListObj = new ej.lists.ListView({
        dataSource: messageDataSource,
        template: getListTemplate(),
        fields: { id: 'ContactID', text: 'text' },
        sortOrder: 'None'
    });
    grpListObj.select = select;
    grpListObj.appendTo('#listview-grp');
    acrdnObj.appendTo('#accordian');
    toolbarHeader = document.getElementById('toolbar_align').ej2_instances[0];
    toolbarHeader.clicked = toolbarClick;
    renderTreeContextMenu();
    renderMoveToList();
    renderCategoryList();
    renderMoreList();
    renderReplyAllList();
}
function renderMoveToList() {
    var themeList = [
        { text: 'Inbox' }, { text: 'Sent Items' }, { text: 'Clutter' }, { text: 'Drafts' },
        { text: 'Deleted Items' }, { text: 'Archive' }, { text: 'Junk Mail' }, { text: 'Outbox' },
        { text: 'Personnel' }, { text: 'Sales Reports' }, { text: 'Marketing Reports' },
        { text: 'Richelle Mead' }, { text: 'krystine hobson' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text', value: 'text' },
        valueTemplate: '<div class="tb-dropdowns"> Move to </div>',
        popupHeight: '310px',
        popupWidth: '150px',
        value: 'Inbox',
        width: '80px',
        select: moveToSelect,
        allowFiltering: true
    });
    dropDownListObj.appendTo('#moveToList');
}
function renderReplyAllList() {
    var themeList = [
        { text: 'Reply' }, { text: 'Reply All' }, { text: 'Forward' }
    ];
    ddlReplyAll = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div>' +
        '<div style="float:left;margin-top: 1px;">' +
        '<span style="font-weight:bold;" class="e-btn-icon ej-icon-Reply-All tb-icons e-icons tb-icon-rply-all">' +
        '</span>' +
        '</div>' +
        '<div class="tb-dropdowns" style="float:left" > Reply All </div>' +
        '<div>',
        popupHeight: '150px',
        popupWidth: '150px',
        width: '115px',
        change: replyAllSelect,
        value: 'Reply All'
    });
    ddlReplyAll.appendTo('#replyAllList');
}
function renderCategoryList() {
    var themeList = [
        { text: 'Blue category', color: 'blue' }, { text: 'Red category', color: 'red' },
        { text: 'Orange category', color: 'orange' }, { text: 'Purple category', color: 'purple' },
        { text: 'Green category', color: 'green' }, { text: 'Yellow category', color: 'yellow' },
        { text: 'Clear categories', color: 'transparent' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div class="tb-dropdowns"> Categories </div>',
        itemTemplate: '<div class="e-list" style="padding:0px 15px">' +
        '<div style="width: 20px;float:left;top: 8px;position: absolute;">' +
        '<div style="width: 10px; height:15px; border-color: ${color}; background-color: ${color};"></div>' +
        '</div>' +
        '<div style="width: 170px;float:left;margin-left: 15px;font-size:12px;"><span>${text}</span></div>' +
        '</div>',
        popupHeight: '250px',
        popupWidth: '230px',
        value: 'Blue category',
        width: '100px'
    });
    dropDownListObj.appendTo('#categoryList');
}
function renderMoreList() {
    var themeList = [
        { text: 'Mark as unread' }, { text: 'Mark as read' }, { text: 'Flag' }, { text: 'Clear Flag' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div class="tb-dropdowns" style ="font-size: 16px;margin-top: -2px;"><span class="e-btn-icon e-icons ej-icon-More"></span> </div>',
        popupHeight: '150px',
        popupWidth: '150px',
        value: 'Mark as read',
        width: '100%'
    });
    dropDownListObj.appendTo('#moreList');
    dropDownListObj.select = moreItemSelect;
}
function renderMoreListMobile() {
    var themeList = [
        { text: 'Mark as unread' }, { text: 'Mark as read' }, { text: 'Flag' },
        { text: 'Clear Flag' }
    ];
    var dropDownListObj1 = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div class="tb-dropdowns" style ="font-size: 16px;margin-top: -2px;"><span class="e-btn-icon e-icons ej-icon-More"></span> </div>',
        popupHeight: '150px',
        popupWidth: '150px',
        value: 'Mark as read',
        width: '100%'
    });
    dropDownListObj1.appendTo('#moreList1');
    dropDownListObj1.select = moreItemSelect;
}
function replyAllSelect(args) {
    if (args.itemData.text) {
        showNewMailPopup(args.itemData.text);
    }
    dropdownSelect = true;
}
function moveToSelect(args) {
    if (args.itemData.text) {
        var selectedMessage = getSelectedMessage();
        var key = 'Folder';
        selectedMessage[key] = args.itemData.text;
        grpListObj.dataSource = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
        showEmptyMessage();
    }
}
function moreItemSelect(args) {
    var selectedMessage = getSelectedMessage();
    var key = '';
    if (args.itemData.text === 'Mark as read') {
        key = 'ContactID';
        setReadStyleMessage(selectedMessage[key].toString(), 'Read');
    }
    else if (args.itemData.text === 'Mark as unread') {
        key = 'ContactID';
        setReadStyleMessage(selectedMessage[key].toString(), 'Unread');
    }
    else {
        var target = selectedListElement.getElementsByClassName('e-btn-icon ej-icon-Flag_1')[0];
        flagListItem(target, selectedMessage);
    }
}
function renderToolbarMobile() {
    toolbarMobile = document.getElementById('toolbar_mobile').ej2_instances[0];
    toolbarMobile.clicked = toolbarClick;
    acSearchMobile = new ej.dropdowns.AutoComplete({
        dataSource: getContacts(),
        fields: { text: 'MailId', value: 'MailId' },
        placeholder: 'Search Mail and People',
        change: autoSearchSelect,
        focus: autoSearchFocus1,
        blur: autoSearchBlur1,
        cssClass: 'search-text-box-device',
        showClearButton: false
    });
    acSearchMobile.appendTo('#txtSearch1');
    renderMoreListMobile();
}
function getListTemplate() {
    return '<div class="template-container ${ReadStyle}-parent">' +
        '<div style="height:30px; pointer-events:none;">' +
        '<div class="sender-style" style="float:left; margin-top: 2px">${text}</div>' +
        '<div style="right:25px; position: absolute; margin-top: 2px; pointer-events:all;">' +
        '<button id="btnListDelete" title="Delete" class="listview-btn">' +
        '<span class="e-btn-icon ej-icon-Delete"></span>' +
        '</button>' +
        '<button id="btnListFlag" title="${FlagTitle}" class="listview-btn">' +
        '<span class="e-btn-icon ej-icon-Flag_1 ${Flagged}"></span>' +
        '</button>' +
        '<button id="btnListRead" title="${ReadTitle}" class="listview-btn">' +
        '<span class="e-btn-icon ej-icon-Mark-as-read"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="subjectstyle ${ReadStyle}" style="height:25px">' +
        '<div style="float:left; margin-top: 2px">${ContactTitle}</div>' +
        '<div style="right:25px; position: absolute; margin-top: 2px">' +
        '<span>${Time}</span>' +
        '</div>' +
        '</div>' +
        '<div class="descriptionstyle">${Message}</div>' +
        '</div>';
}
function showToolbarItems(displayType) {
    var selectedFolder = document.getElementsByClassName('tb-item-Selected');
    for (var i = 0; i < selectedFolder.length; i++) {
        selectedFolder[i].style.display = displayType;
    }
}
function nodeSelected(args) {
    var key = 'id';
    treeSelectedElement = args.node;
    treeviewSelectedData = getTreeData1(args.nodeData[key].toString());
    selectedFolderName = args.node.getElementsByClassName('treeName')[0].innerHTML;
    grpListObj.dataSource = sortList(getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName));
    showEmptyMessage();
    document.getElementById('spanFilterText').innerHTML = selectedFolderName;
    var element1 = document.getElementsByClassName('tb-item-inbox')[0];
    if (element1) {
        element1 = element1.getElementsByClassName('e-tbar-btn-text')[0];
        element1.innerHTML = selectedFolderName;
    }
    hideSideBar();
}
function showEmptyMessage() {
    document.getElementById('emptyMessageDiv').style.display = '';
    document.getElementById('mailarea').style.display = 'none';
    document.getElementById('accordian').style.display = 'none';
    showToolbarItems('none');
    var readingPane = document.getElementById('reading-pane-div');
    readingPane.className = readingPane.className.replace(' new-mail', '');
    document.getElementsByClassName('tb-item-new-mail')[0].style.display = 'inline-flex';
    document.getElementsByClassName('tb-item-mark-read')[0].style.display = 'inline-flex';
}
function showSelectedMessage() {
    document.getElementById('emptyMessageDiv').style.display = 'none';
    document.getElementById('mailarea').style.display = 'none';
    document.getElementById('accordian').style.display = '';
    showToolbarItems('inline-flex');
    var readingPane = document.getElementById('reading-pane-div');
    readingPane.className = readingPane.className.replace(' new-mail', '');
    document.getElementsByClassName('tb-item-new-mail')[0].style.display = 'inline-flex';
    document.getElementsByClassName('tb-item-mark-read')[0].style.display = 'none';
}
function getFilteredDataSource(dataSource, columnName, columnValue) {
    var folderData = [];
    for (var i = 0; i < dataSource.length; i++) {
        var data = dataSource[i];
        if (data[columnName] && data[columnName].toString() === columnValue) {
            folderData.push(data);
        }
    }
    return folderData;
}
function setReadStyleMessage(contactID, readStyle) {
    var data = getSelectedMessage();
    selectedFolderName = data.Folder;
    if (data !== null) {
        var key = 'ReadStyle';
        data[key] = readStyle;
        key = 'ReadTitle';
        var readNode = selectedListElement.getElementsByClassName('e-btn-icon ej-icon-Mark-as-read')[0].parentNode;
        if (readStyle === 'Read') {
            data[key] = 'Mark as unread';
            selectedListElement.getElementsByClassName('subjectstyle')[0].className = 'subjectstyle';
            selectedListElement.getElementsByClassName('template-container')[0].className =
                'template-container';
            readNode.title = 'Mark as unread';
            setReadCount('Unread');
        }
        else {
            data[key] = 'Mark as read';
            readNode.title = 'Mark as read';
            selectedListElement.getElementsByClassName('subjectstyle')[0].className =
                'subjectstyle Unread';
            selectedListElement.getElementsByClassName('template-container')[0].className =
                'template-container Unread-parent';
            setReadCount('Read');
        }
    }
}
function getSelectedMessage() {
    if (grpListObj.getSelectedItems()) {
        var selectedData = grpListObj.getSelectedItems().data;
        var key = 'ContactID';
        for (var i = 0; i < messageDataSource.length; i++) {
            if (messageDataSource[i][key].toString() === selectedData[key].toString()) {
                return messageDataSource[i];
            }
        }
    }
    return null;
}
function renderTreeContextMenu() {
    var menuItems = [
        { text: 'Create new subfolder' }, { text: 'Rename' }, { text: 'Delete' },
        { text: 'Add to Favorites' }, { text: 'Mark all as read' }
    ];
    var menuOptions = { target: '#tree', items: menuItems };
    treeContextMenu = new ej.navigations.ContextMenu(menuOptions, '#treeContextMenu');
    treeContextMenu.beforeOpen = treeMenuBeforeOpen;
    treeContextMenu.select = treeMenuSelect;
}
function treeMenuSelect(args) {
    if (args.item) {
        var target = treeSelectedElement.getElementsByClassName('e-btn-icon')[0];
        if (args.item.text === 'Create new subfolder') {
            lastIndex += 1;
            var key = 'ID';
            var item = {
                'ID': lastIndex, 'PID': treeviewSelectedData[key].toString(), 'Name': 'New Folder',
                'HasChild': false, 'Expanded': false, 'Count': '',
                'Favorite': 'Favorite', 'FavoriteMessage': 'Add to Favorites'
            };
            treeObj.addNodes([item], null, null);
            treeDataSource.push(item);
            treeObj.beginEdit(lastIndex.toString());
        }
        else if (args.item.text === 'Rename') {
            treeObj.beginEdit(treeviewSelectedData.ID.toString());
        }
        else if (args.item.text === 'Delete') {
            if (selectedFolderName === 'Deleted Items') {
                dlgDelete.content = '<div class="dlg-content-style"><span>Are you sure you want to permanently' +
                    ' delete all the items in Deleted items?</span></div>';
                dlgDelete.header = 'Delete All';
            }
            else {
                dlgDelete.content = '<div class="dlg-content-style"><span>Are you sure you want to move all ' +
                    'its content to Deleted items?</span></div>';
                dlgDelete.header = 'Delete Folder Items';
            }
            dlgDelete.show();
        }
        else if (args.item.text === 'Mark all as read') {
            markAllRead();
        }
        else if (args.item.text === 'Add to Favorites') {
            favoriteAction('add', target);
        }
        else if (args.item.text === 'Remove from Favorites') {
            favoriteAction('Remove', target);
        }
    }
}
function markAllRead() {
    var dataSource = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
    for (var i = 0; i < dataSource.length; i++) {
        var key = 'ReadStyle';
        dataSource[i][key] = 'Read';
        key = 'ReadTitle';
        dataSource[i][key] = 'Mark as unread';
        setReadCount('Unread');
    }
    grpListObj.dataSource = dataSource;
}
function treeMenuBeforeOpen(args) {
    var key = 'PID';
    var parentNode = treeviewSelectedData[key].toString();
    key = 'Favorite';
    var favorite = treeviewSelectedData[key].toString();
    if (favorite === 'Favorite-Composite') {
        favorite = 'Remove from Favorites';
    }
    else {
        favorite = 'Add to Favorites';
    }
    treeContextMenu.items[3].text = favorite;
    treeContextMenu.dataBind();
    if (parentNode === '1') {
        treeContextMenu.hideItems(['Create new subfolder', 'Rename']);
    }
    else {
        treeContextMenu.showItems(['Create new subfolder', 'Rename']);
    }
}
function setCategory(category, dataSource) {
    for (var i = 0; i < dataSource.length; i++) {
        var data = dataSource[i];
        var key = 'category';
        data[key] = category;
    }
    return dataSource;
}
function setReadCount(readType) {
    var selectedFolder = document.getElementsByClassName('treeCount ' + selectedFolderName);
    for (var i = 0; i < selectedFolder.length; i++) {
        var count = selectedFolder[i].innerHTML === '' ? 0 : Number(selectedFolder[i].innerHTML);
        if (readType === 'Unread') {
            if (count > 0) {
                count -= 1;
            }
        }
        else {
            count += 1;
        }
        selectedFolder[i].innerHTML = count === 0 ? '' : count.toString();
    }
}
function select(args) {
    selectedListElement = args.item;
    var data = args.data;
    var key = 'ReadStyle';
    if (data[key].toString() !== 'Read') {
        key = 'ContactID';
        setReadStyleMessage(data[key].toString(), 'Read');
        isItemClick = true;
    }
    var contentElement = document.getElementsByClassName('row content')[0];
    if (window.innerWidth < 605) {
        contentElement.className = 'row content sidebar-hide show-reading-pane';
    }
    var contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    contentWrapper.className = 'content-wrapper';
    showSelectedMessage();
    key = 'ContactTitle';
    if (acrdnObj.items.length === 0) {
        acrdnObj.addItem({
            content: '#accodianContent', expanded: true, header: data[key].toString()
        });
    }
    var headerTitle = document.getElementById('accordian');
    key = 'ContactTitle';
    headerTitle.getElementsByClassName('e-acrdn-header-content')[0].innerHTML = data[key].toString();
    key = 'Image';
    headerTitle.getElementsByClassName('logo logo-style2')[0].style.background =
        'url(' + data[key].toString().replace('styles/images/images/', 'content/images/images/') + ')  no-repeat 50% 50%';
    key = 'text';
    document.getElementById('sub').innerHTML = data[key].toString();
    key = 'Date';
    var dateString = data[key].toString();
    key = 'Time';
    document.getElementById('date').innerHTML = dateString + ' ' + data[key].toString();
    key = 'CC';
    document.getElementById('to').innerHTML = (data[key].toString()).replace(/,/g, ' ; ');
    key = 'Message';
    if (data[key]) {
        document.getElementById('accContent').innerHTML = data[key].toString();
    }
    else {
        document.getElementById('accContent').innerHTML =
            decodeURI('%3Cdiv%20id=%22box%22%20style=%22padding:10px;%20border:%20none;%20height:%20auto;' +
                '%22%20contenteditable=%22true%22%20data-gramm_id=%223898c552-c710-10db-69ec-08371185eb3f%22%20' +
                'data-gramm=%22true%22%20spellcheck=%22false%22%20data-gramm_editor=%22true%22%3E%3Cp%20class=%22' +
                'MsoNormal%22%3EDear%20Name,&nbsp;%3C/p%3E%0A%0A%3Cp%20class=%22MsoNormal%22%3EI%20really%20' +
                'appreciate%20your%20understanding%20and%20support%20regarding%0Athe%20changes%20we\'re%20' +
                'making%20to%20the%20project%20plan.&nbsp;%3C/p%3E%0A%0A%3Cp%20class=%22' +
                'MsoNormal%22%3EThank%20you%20for%20your%20confidence%20in%20me.%20I\'m%20sure%20' +
                'you\'re%20going%0Ato%20be%20pleased%20with%20the%20results.&nbsp;%3C/p%3E%0A%0A%3Cp%20class=%22' +
                'MsoNormal%22%3EBest%20Regards,%3Cbr%3E%0AYour%20Name%3Co:p%3E%3C/o:p%3E%3C/p%3E%0A%0A%20%20%20%20%3C/div%3E');
    }
}
function renderSearchSection() {
    var filterButton = new ej.buttons.Button({
        iconCss: 'ej-icon-Dropdown-arrow',
        cssClass: 'btn-shadow-hide'
    });
    filterButton.appendTo('#btnFilter');
    document.getElementById('btnFilter').onclick = btnFilterClick;
    var atcObj = new ej.dropdowns.AutoComplete({
        dataSource: getContacts(),
        fields: { text: 'MailId', value: 'MailId' },
        placeholder: 'Search Mail and People',
        change: autoSearchSelect,
        focus: autoSearchFocus,
        blur: autoSearchBlur,
        showClearButton: false
    });
    atcObj.appendTo('#txtSearch');
    var button = new ej.buttons.Button({
        iconCss: 'ej-icon-Search',
        cssClass: 'btn-shadow-hide'
    });
    button.appendTo('#btnSearch');
}
function autoSearchSelect(args) {
    if (args.value) {
        var dataSource = messageDataSource;
        grpListObj.dataSource = getFilteredDataSource(dataSource, 'Email', args.value.toString());
        document.getElementById('spanFilterText').innerHTML = 'All Search';
    }
    else {
        resetSelectedFolderData();
    }
}
function autoSearchFocus(args) {
    document.getElementsByClassName('search-div')[0].classList.add('search-focus');
}
function autoSearchBlur(args) {
    document.getElementsByClassName('search-div')[0].classList.remove('search-focus');
}
function autoSearchFocus1(args) {
    document.getElementsByClassName('search-div1')[0].classList.add('search-focus');
}
function autoSearchBlur1(args) {
    document.getElementsByClassName('search-div1')[0].classList.remove('search-focus');
}
function resetSelectedFolderData() {
    document.getElementById('spanFilterText').innerHTML = selectedFolderName;
    var dataSource = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
    grpListObj.dataSource = dataSource;
    clearFilterMenu();
    filterContextMenu.items[0].iconCss = 'ej-icon-Right';
    filterContextMenu.dataBind();
}
function btnFilterClick() {
    var clientRect = document.getElementById('btnFilter').getBoundingClientRect();
    filterContextMenu.open(clientRect.top + 25, clientRect.left);
}
function renderMailDialogs() {
    dlgFavorite = new ej.popups.Dialog({
        width: '335px',
        header: 'Remove From Favorites',
        content: '<div class="dlg-content-style"><span>Do you want to remove from favorites?</span></div>',
        target: document.body,
        isModal: true,
        closeOnEscape: true,
        animationSettings: { effect: 'None' },
        buttons: [
            {
                click: btnFavoriteOKClick, buttonModel: { content: 'Yes', cssClass: 'e-flat', isPrimary: true }
            },
            {
                click: btnFavoriteCancelClick, buttonModel: { content: 'No', cssClass: 'e-flat' }
            }
        ]
    });
    dlgFavorite.appendTo('#favoriteDialog');
    dlgFavorite.hide();
    dlgDelete = new ej.popups.Dialog({
        width: '335px',
        header: 'Delete Folder Items',
        content: '<div class="dlg-content-style"><span>Are you sure you want to move all its content to Deleted items?</span></div>',
        target: document.body,
        isModal: true,
        closeOnEscape: true,
        animationSettings: { effect: 'None' },
        buttons: [
            {
                click: btnDeleteOKClick, buttonModel: { content: 'Yes', cssClass: 'e-flat', isPrimary: true }
            },
            {
                click: btnDeleteCancelClick, buttonModel: { content: 'No', cssClass: 'e-flat' }
            }
        ]
    });
    dlgDelete.appendTo('#deleteDialog');
    dlgDelete.hide();
    dlgNewWindow = new ej.popups.Dialog({
        width: '80%',
        height: '93%',
        target: document.body,
        animationSettings: { effect: 'None' },
        closeOnEscape: true,
        allowDragging: true
    });
    dlgNewWindow.appendTo('#newMailSeparateDialog');
    dlgNewWindow.hide();
    dlgReplyAllWindow = new ej.popups.Dialog({
        width: '80%',
        height: '93%',
        target: document.body,
        animationSettings: { effect: 'None' },
        closeOnEscape: true,
    });
    dlgReplyAllWindow.appendTo('#replyAllSeparateDialog');
    dlgReplyAllWindow.hide();
    dlgSentMail = sentMailDialog('#sentMailDialog', true);
    dlgSentMailNew = sentMailDialog('#sentMailNewWindow', false);
    dlgDiscard = discardDialog('#discardDialog', true);
    dlgDiscardNew = discardDialog('#discardNewWindow', false);
}
function sentMailDialog(name, isModal) {
    var dialog = new ej.popups.Dialog({
        width: '335px',
        header: 'Mail Sent',
        content: '<div class="dlg-content-style"><span>Your mail has been sent successfully.</span></div>',
        target: document.body,
        isModal: isModal,
        closeOnEscape: true,
        animationSettings: { effect: 'None' },
        buttons: [{
            click: sendExitClick,
            buttonModel: { content: 'OK', cssClass: 'e-flat', isPrimary: true }
        }]
    });
    dialog.appendTo(name);
    dialog.hide();
    return dialog;
}
function discardDialog(name, isModal) {
    var dialog = new ej.popups.Dialog({
        width: '335px',
        header: 'Discard message',
        content: '<div id=' + name + 'discardOk' + ' style="cursor:pointer" class="dlg-content-style1">' +
        '<span style="color:white" class="dlg-discard-text-style">Discard</span> <br/>' +
        '<span style="color:white; font-weight:normal" class="dlg-discard-child-text-style">This message will be deleted</span>' +
        '</div> <br/>' +
        '<div id=' + name + 'discardCancel' + ' style="cursor:pointer" class="dlg-content-style">' +
        '<span class="dlg-discard-text-style">Don' + "'" + 't Discard</span> <br/>' +
        '<span style="font-weight:normal" class="dlg-discard-child-text-style">Return to the message for further editing</span>' +
        '</div>',
        target: document.body,
        isModal: isModal,
        closeOnEscape: true,
        animationSettings: { effect: 'None' }
    });
    dialog.appendTo(name);
    document.getElementById(name + 'discardOk').onclick = discardOkClick;
    document.getElementById(name + 'discardCancel').onclick = discardCancelClick;
    dialog.hide();
    return dialog;
}
function discardOkClick() {
    discardClick();
}
function discardCancelClick() {
    if (dlgNewWindow.visible || dlgReplyAllWindow.visible) {
        dlgDiscardNew.hide();
    }
    else {
        dlgDiscard.hide();
    }
}
function btnFavoriteOKClick() {
    var key = 'PID';
    var parentID = treeviewSelectedData[key].toString();
    if (parentID === '1') {
        key = 'ID';
        removeTreeItem(treeviewSelectedData[key].toString());
        treeDataSource.splice(treeDataSource.indexOf(treeviewSelectedData), 1);
    }
    else {
        for (var i = 0; i < treeDataSource.length; i++) {
            var key_1 = 'PID';
            var treeData = treeDataSource[i];
            if (treeData[key_1] && treeData[key_1].toString() === '1') {
                key_1 = 'Name';
                if (treeData[key_1].toString() === selectedFolderName) {
                    key_1 = 'ID';
                    removeTreeItem(treeData[key_1].toString());
                    treeDataSource.splice(i, 1);
                    break;
                }
            }
        }
    }
    dlgFavorite.hide();
}
function btnFavoriteCancelClick() {
    dlgFavorite.hide();
}
function btnDeleteOKClick() {
    var folderMessages = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
    if (selectedFolderName === 'Deleted Items') {
        for (var i = 0; i < folderMessages.length; i++) {
            messageDataSource.splice(messageDataSource.indexOf(folderMessages[i]), 1);
        }
    }
    else {
        for (var j = 0; j < folderMessages.length; j++) {
            var key = 'Folder';
            folderMessages[j][key] = 'Deleted Items';
        }
    }
    grpListObj.dataSource = [];
    showEmptyMessage();
    dlgDelete.hide();
}
function btnDeleteCancelClick() {
    dlgDelete.hide();
}
function removeTreeItem(id) {
    treeObj.removeNodes([id]);
    var element = document.getElementsByClassName('ej-icon-Favorite-Composite ' + selectedFolderName)[0];
    element.className = 'e-btn-icon ej-icon-Favorite ' + selectedFolderName;
    var parent = element.parentNode;
    parent.title = 'Add to Favorites';
    var key = 'FavoriteMessage';
    treeviewSelectedData[key] = 'Add to Favorites';
    key = 'Favorite';
    treeviewSelectedData[key] = 'Favorite';
}
function updateLoginDetails() {
    document.getElementById('username').textContent = userName;
    document.getElementById('username1').textContent = userName;
    document.getElementById('usermail').textContent = userMail;
    document.getElementById('usermail1').textContent = userMail;
}
function createHeader() {
    var notificationButton = new ej.buttons.Button({ iconCss: 'ej-icon-Notify', cssClass: 'btn-shadow-hide' });
    notificationButton.appendTo('#btnNotification');
    var btnSettings = new ej.buttons.Button({ iconCss: 'ej-icon-Settings', cssClass: 'btn-shadow-hide' });
    btnSettings.appendTo('#btnSettings');
    var btnAbout = new ej.buttons.Button({ iconCss: 'ej-icon-Help-white', cssClass: 'btn-shadow-hide' });
    btnAbout.appendTo('#btnAbout');
    var btnLoginName = new ej.buttons.Button({ content: userName, cssClass: 'btn-shadow-hide' });
    btnLoginName.appendTo('#btnLoginName');
    var closeButton = new ej.buttons.Button({ iconCss: 'ej-icon-Close', cssClass: 'btn-shadow-hide' });
    closeButton.appendTo('#btnCloseButton');
    document.getElementById('btnCloseButton').onclick = btnCloseClick;
    var closeButton1 = new ej.buttons.Button({ iconCss: 'ej-icon-Close', cssClass: 'btn-shadow-hide' });
    closeButton.appendTo('#btnCloseButton1');
    document.getElementById('btnCloseButton1').onclick = hideSideBar;
}
function btnCloseClick() {
    var contentWrapper = document.getElementsByClassName('row content')[0];
    contentWrapper.className = contentWrapper.className.replace(' show-header-content', '');
    var headerRP = document.getElementsByClassName('header-right-pane selected')[0];
    headerRP.className = 'header-right-pane';
}
function sortList(listItems) {
    for (var i = 0; i < listItems.length; i++) {
        listItems[i] = setCategory1(listItems[i]);
    }
    return listItems;
}
function setCategory1(listItem) {
    var key = 'Date';
    var date = new Date(listItem[key]);
    var currentData = new Date();
    var oldDate = date.getDate();
    var oldMonth = date.getMonth();
    var oldYear = date.getFullYear();
    var currentDate = currentData.getDate();
    var currentMonth = currentData.getMonth();
    var currentYear = currentData.getFullYear();
    key = 'category';
    if (oldYear === currentYear) {
        if (oldMonth === currentMonth) {
            if (oldDate === currentDate) {
                listItem[key] = 'Today';
            }
            else if (oldDate === currentDate - 1) {
                listItem[key] = 'Yesterday';
            }
            else if (oldDate + 8 >= currentDate) {
                listItem[key] = 'Last Week';
            }
            else if (oldDate + 15 >= currentDate) {
                listItem[key] = 'Two Weeks Ago';
            }
            else if (oldDate + 22 >= currentDate) {
                listItem[key] = 'Three Weeks Ago';
            }
            else {
                listItem[key] = 'Earlier this Month';
            }
        }
        else {
            listItem[key] = 'Last Month';
        }
    }
    else {
        listItem[key] = 'Older';
    }
    return listItem;
}
function headerContent(headerElement) {
    var headerRP = document.getElementsByClassName('header-right-pane selected')[0];
    if (headerRP) {
        headerRP.className = 'header-right-pane';
    }
    var contentWrapper = document.getElementsByClassName('row content')[0];
    contentWrapper.className = contentWrapper.className.replace(' show-header-content', '') + ' show-header-content';
    var notificationElement = document.getElementsByClassName('notification-content')[0];
    var settingsElement = document.getElementsByClassName('settings-content')[0];
    var aboutElement = document.getElementsByClassName('about-content')[0];
    var userElement = document.getElementsByClassName('profile-content')[0];
    var txtHeaderContent = document.getElementById('txtHeaderContent');
    notificationElement.style.display = 'none';
    settingsElement.style.display = 'none';
    aboutElement.style.display = 'none';
    userElement.style.display = 'none';
    headerElement.className = headerElement.className + ' ' + 'selected';
    switch (headerElement.id) {
        case 'notification-div':
            notificationElement.style.display = 'block';
            txtHeaderContent.innerHTML = 'Notification';
            break;
        case 'settings-div':
            settingsElement.style.display = 'block';
            txtHeaderContent.innerHTML = 'Settings';
            break;
        case 'profile-div':
            userElement.style.display = 'block';
            txtHeaderContent.innerHTML = 'My accounts';
            break;
        case 'about-div':
            aboutElement.style.display = 'block';
            txtHeaderContent.innerHTML = 'Help';
            break;
    }
}
function toolbarClick(args) {
    var contentElement;
    var contentWrapper;
    if (args.item) {
        if (args.item.prefixIcon === 'ej-icon-Menu tb-icons') {
            var sidebarElement = document.getElementsByClassName('sidebar')[0];
            sidebarElement.className = 'sidebar show';
            var overlayElement = document.getElementsByClassName('overlay-element')[0];
            overlayElement.className = 'overlay-element show1';
            isMenuClick = true;
        }
        else if (args.item.prefixIcon === 'ej-icon-Back') {
            contentElement = document.getElementsByClassName('row content')[0];
            contentElement.className = contentElement.className.replace('show-reading-pane', 'show-message-pane');
            contentWrapper = document.getElementsByClassName('content-wrapper')[0];
            if (contentWrapper.className.indexOf('show-search-option') !== -1) {
                resetSelectedFolderData();
            }
            contentWrapper.className = 'content-wrapper';
        }
        else if (args.item.prefixIcon === 'ej-icon-Mark-as-read tb-icons') {
            markAllRead();
        }
        else if (args.item.text === 'Delete' || args.item.prefixIcon === 'ej-icon-Delete' ||
            args.item.text === 'Junk') {
            var selectedMessage = getSelectedMessage();
            messageDataSource.splice(messageDataSource.indexOf(selectedMessage), 1);
            var key = 'ContactID';
            grpListObj.removeItem({ id: selectedMessage[key].toString(), text: selectedMessage['text'].toString() });
            if (args.item.prefixIcon === 'ej-icon-Delete' && window.innerWidth < 605) {
                contentElement = document.getElementsByClassName('row content')[0];
                contentElement.className = contentElement.className.replace('show-reading-pane', 'show-message-pane');
            }
            else {
                showEmptyMessage();
            }
        }
        else if ((args.item.text === 'New' || args.item.prefixIcon === 'ej-icon-Create-New') ||
            (args.item.prefixIcon === 'ej-icon-Reply-All')) {
            if (args.item.prefixIcon === 'ej-icon-Create-New') {
                contentWrapper = document.getElementsByClassName('content-wrapper')[0];
                contentWrapper.className = 'content-wrapper hide-message-option';
            }
            var option = 'New';
            if (args.item.prefixIcon === 'ej-icon-Reply-All') {
                option = 'Reply All';
            }
            if (window.innerWidth < 605) {
                contentElement = document.getElementsByClassName('row content')[0];
                contentElement.className = contentElement.className.replace('show-message-pane', 'show-reading-pane');
            }
            showNewMailPopup(option);
        }
        else if (args.item.prefixIcon === 'ej-icon-Send') {
            sendClick();
        }
        else if (args.item.prefixIcon === 'ej-icon-Search') {
            contentWrapper = document.getElementsByClassName('content-wrapper')[0];
            contentWrapper.className = 'content-wrapper show-search-option';
            toolbarMobile.refreshOverflow();
        }
        else if (args.item.prefixIcon === 'ej-icon-Close') {
            acSearchMobile.value = '';
        }
        else if (args.item.prefixIcon === 'ej-icon-Copy tb-icons') {
            if (!dlgReplyAllWindow.content) {
                dlgReplyAllWindow.content = document.getElementById('reading-pane-popup');
                dlgReplyAllWindow.refresh();
            }
            dlgReplyAllWindow.show();
            bindReadingPaneData(getSelectedMessage());
        }
    }
}
function showNewMailPopup(option) {
    var selectedMessage = getSelectedMessage();
    showToolbarItems('none');
    document.getElementById('reading-pane-div').className += ' new-mail';
    document.getElementById('accordian').style.display = 'none';
    document.getElementById('emptyMessageDiv').style.display = 'none';
    document.getElementById('mailarea').style.display = '';
    document.getElementById('mailarea').appendChild(document.getElementById('newmailContent'));
    document.getElementsByClassName('tb-item-new-mail')[0].style.display = 'none';
    document.getElementsByClassName('tb-item-mark-read')[0].style.display = 'none';
    showMailDialog(option, selectedMessage);
}
function onWindowResize() {
    var headerNode = document.getElementsByClassName('header navbar')[0];
    var contentArea = document.getElementsByClassName('row content')[0];
    var isReadingPane = (contentArea.className.indexOf('show-reading-pane') === -1);
    if (!isReadingPane && window.innerWidth < 605) {
        return;
    }
    if (window.innerWidth < 1200) {
        headerNode.className = 'header navbar head-pane-hide';
        var headerRP = document.getElementsByClassName('header-right-pane selected')[0];
        if (headerRP) {
            headerRP.className = 'header-right-pane';
        }
        contentArea.className = 'row content';
    }
    else {
        headerNode.className = 'header navbar';
        if (contentArea.className.indexOf('show-header-content') === -1) {
            contentArea.className = 'row content';
        }
        else {
            contentArea.className = 'row content show-header-content';
        }
    }
    if (window.innerWidth < 1090) {
        contentArea.className = 'row content sidebar-hide';
    }
    else {
        hideSideBar();
    }
    if (window.innerWidth < 605) {
        if (isReadingPane) {
            contentArea.className = contentArea.className + ' ' + 'show-message-pane';
        }
    }
    toolbarMobile.refreshOverflow();
}
function hideSideBar() {
    if (!isMenuClick) {
        var sidebar = document.getElementsByClassName('sidebar')[0];
        if (sidebar.className.indexOf('sidebar show') !== -1) {
            sidebar.className = 'sidebar';
            var overlayElement = document.getElementsByClassName('overlay-element')[0];
            overlayElement.className = 'overlay-element';
        }
    }
    isMenuClick = false;
}
function sendExitClick() {
    if (dlgNewWindow.visible || dlgReplyAllWindow.visible) {
        dlgSentMailNew.hide();
    }
    else {
        dlgSentMail.hide();
    }
    discardClick();
}
function sendClick() {
    if (dlgNewWindow.visible || dlgReplyAllWindow.visible) {
        dlgSentMailNew.show();
    }
    else {
        dlgSentMail.show();
    }
}
function discardButtonClick() {
    if (dlgNewWindow.visible || dlgReplyAllWindow.visible) {
        dlgDiscardNew.show();
    }
    else {
        dlgDiscard.show();
    }
}
function discardClick() {
    if (grpListObj.getSelectedItems()) {
        showSelectedMessage();
    }
    else {
        showEmptyMessage();
    }
    if (dlgNewWindow.visible || dlgReplyAllWindow.visible) {
        dlgDiscardNew.hide();
        if (dlgNewWindow.visible) {
            dlgNewWindow.hide();
        }
        else if (dlgReplyAllWindow.visible) {
            dlgReplyAllWindow.hide();
        }
    }
    else {
        dlgDiscard.hide();
    }
    var contentWrapper = document.getElementsByClassName('content-wrapper')[0];
    contentWrapper.className = 'content-wrapper';
}
function getTreeData1(id) {
    for (var i = 0; i < treeDataSource.length; i++) {
        var key = 'ID';
        if (treeDataSource[i][key].toString() === id) {
            return treeDataSource[i];
        }
    }
    return null;
}
function renderFilterContextMenu() {
    var menuItems = [
        { text: 'All', iconCss: 'ej-icon-Right' }, { text: 'Unread' },
        { text: 'Flagged' }, { separator: true }, {
            text: 'Sort by', items: [{ text: 'None' },
            { text: 'Ascending', iconCss: 'ej-icon-Right' }, { text: 'Descending' }]
        }
    ];
    var menuOptions = { items: menuItems };
    filterContextMenu = new ej.navigations.ContextMenu(menuOptions, '#filterContextMenu');
    filterContextMenu.select = filterMenuSelect;
}
function filterMenuSelect(args) {
    if (args.item) {
        if (args.item.text === 'Ascending' || args.item.text === 'Descending' || args.item.text === 'None') {
            grpListObj.sortOrder = args.item.text;
            for (var i = 0; i < filterContextMenu.items[4].items.length; i++) {
                filterContextMenu.items[4].items[i].iconCss = '';
            }
            args.item.iconCss = 'ej-icon-Right';
        }
        else if (args.item.text !== 'Sort by') {
            clearFilterMenu();
            var dataSource = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
            if (args.item.text === 'All') {
                grpListObj.dataSource = dataSource;
            }
            else if (args.item.text === 'Flagged') {
                grpListObj.dataSource = getFilteredDataSource(dataSource, 'Flagged', 'Flagged');
            }
            else if (args.item.text === 'Unread') {
                grpListObj.dataSource = getFilteredDataSource(dataSource, 'ReadStyle', 'Unread');
            }
            args.item.iconCss = 'ej-icon-Right';
        }
    }
}
function clearFilterMenu() {
    for (var i = 0; i < filterContextMenu.items.length; i++) {
        if (filterContextMenu.items[i].items.length === 0) {
            filterContextMenu.items[i].iconCss = '';
        }
    }
}
function cloneObject(obj) {
    var keys = Object.keys(obj);
    var cloneObject = {};
    for (var i = 0; i < keys.length; i++) {
        cloneObject[keys[i]] = obj[keys[i]];
    }
    return cloneObject;
}
function documentClick(evt) {
    var key = 'parentID';
    if (evt.target instanceof HTMLElement) {
        var target = evt.target;
        if (target.className.indexOf('header-right-pane') !== -1) {
            headerContent(evt.target);
        }
        else if (!dropdownSelectRP && dlgReplyAllWindow.visible && target.innerText === ddlLastRplyValueRP) {
            showMailDialogRP(ddlLastRplyValueRP);
        }
        else if (!dropdownSelect && !dlgReplyAllWindow.visible && target.innerText === ddlReplyAll.value) {
            showNewMailPopup(ddlReplyAll.value);
        }
        else {
            if (target.tagName === 'SPAN' || (target.children && target.children.length > 0)) {
                target = target.tagName === 'SPAN' ? target : target.children[0];
                if (target.className === 'e-btn-icon ej-icon-Favorite ' + selectedFolderName) {
                    favoriteAction('add', target);
                }
                else if (target.className === 'e-btn-icon ej-icon-Favorite-Composite ' + selectedFolderName) {
                    favoriteAction('remove', target);
                }
                else if (target.parentNode.className === 'listview-btn') {
                    var selectedMessage = getSelectedMessage();
                    if (target.className.indexOf('ej-icon-Delete') !== -1) {
                        messageDataSource.splice(messageDataSource.indexOf(selectedMessage), 1);
                        key = 'ContactID';
                        grpListObj.removeItem({ id: selectedMessage[key].toString(), text: selectedMessage['text'].toString() });
                   }
                    else if (target.className.indexOf('ej-icon-Flag_1') !== -1) {
                        flagListItem(target, selectedMessage);
                    }
                    else if (target.className.indexOf('ej-icon-Mark-as-read') !== -1 && !isItemClick) {
                        var parentNode = target.parentNode;
                        if (parentNode.title === 'Mark as read') {
                            parentNode.title = 'Mark as unread';
                            key = 'ContactID';
                            setReadStyleMessage(selectedMessage[key].toString(), 'Read');
                        }
                        else if (parentNode.title === 'Mark as unread') {
                            parentNode.title = 'Mark as read';
                            key = 'ContactID';
                            setReadStyleMessage(selectedMessage[key].toString(), 'Unread');
                        }
                    }
                }
            }
        }
    }
    newmailWindowItemClick();
    readingPaneItemClick();
    isItemClick = false;
    dropdownSelect = false;
}
function documentDoubleClick(evt) {
    if (evt.target instanceof HTMLElement) {
        var target = evt.target;
        if (target.className.indexOf('template-container') !== -1) {
            if (!dlgReplyAllWindow.content) {
                dlgReplyAllWindow.content = document.getElementById('reading-pane-popup');
                dlgReplyAllWindow.refresh();
            }
            dlgReplyAllWindow.show();
            bindReadingPaneData(getSelectedMessage());
        }
    }
}
function newmailWindowItemClick() {
    if (selectedToolbarItem) {
        if (selectedToolbarItem === 'tb-item-window-mail') {
            discardClick();
            dlgNewWindow.content = document.getElementById('newmailContent');
            dlgNewWindow.refresh();
            dlgNewWindow.show();
        }
        else if (selectedToolbarItem === 'tb-item-back-mail') {
            dlgNewWindow.hide();
        }
        else if (selectedToolbarItem === 'Send') {
            sendClick();
        }
        else if (selectedToolbarItem === 'Discard') {
            discardButtonClick();
        }
    }
    resetSelectedToolbarItem('');
}
function readingPaneItemClick() {
    if (selectedRPToolbarItem) {
        if (selectedRPToolbarItem === 'SendClick') {
            sendClick();
        }
        else if (selectedRPToolbarItem === 'DiscardClick') {
            discardButtonClick();
        }
        else if (selectedRPToolbarItem === 'DeleteClick' || selectedRPToolbarItem === 'JunkClick') {
            var selectedMessage = getSelectedMessage();
            messageDataSource.splice(messageDataSource.indexOf(selectedMessage), 1);
            var key = 'ContactID';
            grpListObj.removeItem({ id: selectedMessage[key].toString(), text: selectedMessage['text'].toString() });
            showEmptyMessage();
            dlgReplyAllWindow.hide();
        }
        else if (selectedRPToolbarItem === 'ClosePopup') {
            dlgReplyAllWindow.hide();
        }
    }
    resetRPSelectedItem('');
}
function favoriteAction(type, target) {
    if (type === 'add') {
        target.className = 'e-btn-icon ej-icon-Favorite-Composite ' + selectedFolderName;
        target.parentNode.title = 'Remove from Favorites';
        var treeData = cloneObject(treeviewSelectedData);
        var key = 'PID';
        treeData[key] = '1';
        key = 'ID';
        treeData[key] = Number(treeData[key]) + 111;
        key = 'Favorite';
        treeviewSelectedData[key] = treeData[key] = 'Favorite-Composite';
        key = 'Count';
        treeData[key] = target.parentNode.parentNode.childNodes[1].childNodes[0].innerHTML;
        key = 'FavoriteMessage';
        treeviewSelectedData[key] = treeData[key] = 'Remove from Favorites';
        treeDataSource.push(treeData);
        treeObj.addNodes([treeData], null, null);
    }
    else {
        var ss = document.getElementsByClassName('sidebar')[0];
        dlgFavorite.show();
    }
}
function flagListItem(target, selectedMessage) {
    var key = 'Flagged';
    var parentNode = target.parentNode;
    if (target.className.indexOf('Flagged') !== -1) {
        parentNode.title = 'Flag this Message';
        target.className = 'e-btn-icon ej-icon-Flag_1';
        selectedMessage[key] = 'None';
        key = 'FlagTitle';
        selectedMessage[key] = 'Flag this Message';
    }
    else {
        parentNode.title = 'Remove the flag from this message';
        target.className = 'e-btn-icon ej-icon-Flag_1 Flagged';
        selectedMessage[key] = 'Flagged';
        key = 'FlagTitle';
        selectedMessage[key] = 'Remove the flag from this message';
    }
}
function popupContentClick(evt) {
    if (evt.target instanceof HTMLElement) {
        var target = evt.target;
        if (target.className !== 'e-btn-icon ej-icon-Close' && window.innerWidth >= 1090) {
            var key = 'ContactID';
            grpListObj.selectItem({ id: messageDataSource[0][key].toString() });
            if (!dlgReplyAllWindow.content) {
                dlgReplyAllWindow.content = document.getElementById('reading-pane-popup');
                dlgReplyAllWindow.refresh();
            }
            dlgReplyAllWindow.show();
            bindReadingPaneData(messageDataSource[0]);
        }
        popup1.hide();
    }
}
function popupMouseEnter() {
    hoverOnPopup = true;
}
function popupMouseLeave() {
    hoverOnPopup = false;
    hidePopup();
}
function hidePopup() {
    setTimeout(function () {
        if (!hoverOnPopup) {
            popup1.hide();
        }
    }, 2000);
}
function openPopup() {
    var newMessageData = cloneObject(messageDataSource[Math.floor(Math.random() * (50 - 3) + 2)]);
    var key = 'text';
    document.getElementById('popup-contact').innerHTML = newMessageData[key].toString();
    key = 'ContactTitle';
    document.getElementById('popup-subject').innerHTML = newMessageData[key].toString();
    key = 'Message';
    document.getElementById('popup-message-content').innerHTML = newMessageData[key].toString();
    key = 'Image';
    document.getElementById('popup-image').style.background = 'url(' +
        newMessageData[key].toString().replace('styles/images/images/', 'content/images/images/') + ') no-repeat 50% 50%';
    key = 'Folder';
    newMessageData[key] = 'Inbox';
    key = 'ReadStyle';
    newMessageData[key] = 'Unread';
    key = 'ReadTitle';
    newMessageData[key] = 'Mark as read';
    key = 'Flagged';
    newMessageData[key] = 'None';
    key = 'FlagTitle';
    newMessageData[key] = 'Flag this message';
    key = 'ContactID';
    newMessageData[key] = 'SF20032';
    var element = document.querySelector('#popup');
    element.onmouseenter = popupMouseEnter;
    element.onmouseleave = popupMouseLeave;
    popup1 = new ej.popups.Popup(element, {
        offsetX: -5, offsetY: 5, relateTo: '#content-area',
        position: { X: 'right', Y: 'top' },
    });
    if (window.innerWidth > 605) {
        popup1.show();
    }
    else {
        popup1.hide();
    }
    var dataSource = getFilteredDataSource(messageDataSource, 'Folder', selectedFolderName);
    dataSource.splice(0, 0, newMessageData);
    messageDataSource.splice(0, 0, newMessageData);
    grpListObj.dataSource = dataSource;
    setReadCount('Read');
    setTimeout(function () { hidePopup(); }, 2000);
}


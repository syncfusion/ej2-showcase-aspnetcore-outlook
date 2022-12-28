var window;
var rplyToolbar = new ej.navigations.Toolbar();
var readingpaneToolbarHeader = new ej.navigations.Toolbar();
var autoToList = new ej.dropdowns.MultiSelect();
var autoCCList = new ej.dropdowns.MultiSelect();
var toolbarMail = new ej.navigations.Toolbar();
var readAcrdnObj = new ej.navigations.Accordion();
var selectedRPToolbarItem = '';
var ddlLastRplyValueRP = 'Reply All';
var dropdownSelectRP = false;
var selectedMessage = null;
var toolbarItem = [
    { prefixIcon: 'ej-icon-Font tb-icons', tooltipText: 'Font' },
    { prefixIcon: 'ej-icon-Font-Size path2 tb-icons', tooltipText: 'Font Size' },
    { prefixIcon: 'ej-icon-Bold tb-icons', tooltipText: 'Bold' },
    { prefixIcon: 'ej-icon-Italic tb-icons', tooltipText: 'Italic' },
    { prefixIcon: 'ej-icon-Underlined tb-icons', tooltipText: 'Underline' },
    { prefixIcon: 'ej-icon-Highlight tb-icons', tooltipText: 'Highlight' },
    { prefixIcon: 'ej-icon-Font-Color-Icon tb-icons', tooltipText: 'Font color' },
    { prefixIcon: 'ej-icon-Bullets tb-icons', tooltipText: 'Bullets' },
    { prefixIcon: 'ej-icon-Numbering tb-icons', tooltipText: 'Numbering' },
    { prefixIcon: 'ej-icon-Decr-Indent tb-icons', tooltipText: 'Decrease Indent' },
    { prefixIcon: 'ej-icon-Incr-Indent tb-icons', tooltipText: 'Increase Indent' },
    { prefixIcon: 'ej-icon-Left-aligned tb-icons', tooltipText: 'Decrease Indent' },
    { prefixIcon: 'ej-icon-Centre-aligned tb-icons', tooltipText: 'Increase Indent' },
    { prefixIcon: 'ej-icon-Right-aligned tb-icons', tooltipText: 'Decrease Indent' },
    { prefixIcon: 'ej-icon-Hyperlink tb-icons', tooltipText: 'Hyperlink' }
];
window.readingpane = function () {
    renderReplyToolBar();
    renderNewMailToolbar();
    createReadMailForm();
};
function renderReplyToolBar() {
    readAcrdnObj.appendTo('#rp-accordian');
    var replyTemplate = '<input type="text" tabindex="1" id="rp-replyAllList" />';
    var moreTemplate = '<input type="text" tabindex="1" id="rp-moreList" />';
    rplyToolbar = new ej.navigations.Toolbar({
        items: [
            {
                prefixIcon: 'ej-icon-Reply-All tb-icons', template: replyTemplate,
                cssClass: 'tb-item-replyAll', tooltipText: 'Reply All'
            },
            {
                prefixIcon: 'ej-icon-Delete tb-icons', text: 'Delete', tooltipText: 'Delete'
            },
            {
                text: 'Junk', tooltipText: 'Mark the sender as unsafe and delete the message'
            },
            { template: moreTemplate, cssClass: 'tb-item-more', tooltipText: 'More actions' },
            {
                prefixIcon: 'ej-icon-Close tb-icons', align: 'Right',
                tooltipText: 'Close', cssClass: 'rp-tp-item-Close'
            }
        ],
        width: '100%',
        height: '100%'
    });
    rplyToolbar.overflowMode = 'Popup';
    rplyToolbar.appendTo('#rp-toolbar_align');
    rplyToolbar.clicked = toolbarClick1;
    renderMoreList1();
    renderReplyAllList1();
}
function renderNewMailToolbar() {
    var moreTemplate = '<input type="text" tabindex="1" id="rp-moreList2" />';
    readingpaneToolbarHeader = new ej.navigations.Toolbar({
        items: [
            { prefixIcon: 'ej-icon-Send tb-icons', text: 'Send', tooltipText: 'Send' },
            { prefixIcon: 'ej-icon-Attach tb-icons', text: 'Attach', tooltipText: 'Attach' },
            { text: 'Discard' },
            { template: moreTemplate, cssClass: 'tb-item-more tb-item-more-mail', tooltipText: 'More actions' },
            {
                prefixIcon: 'ej-icon-Close tb-icons', align: 'Right',
                tooltipText: 'Close', cssClass: 'rp-tp-item-Close'
            }
        ],
        height: '100%'
    });
    readingpaneToolbarHeader.overflowMode = 'Popup';
    readingpaneToolbarHeader.appendTo('#rp-toolbar_newmail');
    readingpaneToolbarHeader.clicked = toolbarReadingpaneNewMail;
    renderMailMoreList();
    readingpaneToolbarHeader.refreshOverflow();
}
function renderReplyAllList1() {
    var themeList = [
        { text: 'Reply' }, { text: 'Reply All' }, { text: 'Forward' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
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
    dropDownListObj.appendTo('#rp-replyAllList');
}
function renderMoreList1() {
    var themeList = [
        { text: 'Mark as unread' }, { text: 'Mark as read' }, { text: 'Flag' }, { text: 'Clear Flag' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div class="tb-dropdowns" style ="font-size: 16px;margin-top: -2px;">' +
        '<span class="e-btn-icon e-icons ej-icon-More"></span></div>',
        popupHeight: '150px',
        popupWidth: '150px',
        value: 'Mark as read',
        width: '100%'
    });
    dropDownListObj.appendTo('#rp-moreList');
}
function toolbarClick1(args) {
    if (args.item) {
        if (args.item.prefixIcon === 'ej-icon-Close tb-icons') {
            selectedRPToolbarItem = 'ClosePopup';
        }
        else if (args.item.text === 'Delete' || args.item.text === 'Junk') {
            selectedRPToolbarItem = args.item.text + 'Click';
        }
    }
}
function replyAllSelect(args) {
    if (args.itemData.text) {
        showMailDialogRP(args.itemData.text);
        ddlLastRplyValueRP = args.itemData.text;
        dropdownSelectRP = true;
    }
}
function createReadMailForm() {
    var toButton = new ej.buttons.Button();
    toButton.appendTo('#rp-btnTo');
    var ccButton = new ej.buttons.Button();
    ccButton.appendTo('#rp-btnCc');
    var sendButton = new ej.buttons.Button({ isPrimary: true });
    sendButton.appendTo('#rp-btnSend');
    document.getElementById('rp-btnSend').onclick = btnRPSendClick;
    var discardButton = new ej.buttons.Button();
    discardButton.appendTo('#rp-btnDiscard');
    document.getElementById('rp-btnDiscard').onclick = btnRPDiscardClick;
    autoToList = new ej.dropdowns.MultiSelect({
        dataSource: getContacts(), placeholder: '...', width: 'calc(100% - 60px)',
        cssClass: 'ac-new-mail',
        fields: { text: 'MailId', value: 'MailId' },
        delimiterChar: ';',
        hideSelectedItem: true,
        popupWidth: '300px',
        allowFiltering: true,
        itemTemplate: '<div class="multiselect-template parent-div"><img class="contacts-item-image-style"' +
        'src="${Image}" alt="employee"/>' +
        '<div class="contacts-item-text-style"> <div> ${text} </div> </div>' +
        '<div class="contacts-item-subtext-style"> ${MailId} </div>' +
        '</div>',
        valueTemplate: '<div style="width:100%;height:100%;">' +
        '<img class="contacts-value-img-style" src="${Image}" alt="employee"/>' +
        '<div class="contacts-value-text-style"> ${MailId} </div></div>',
        mode: 'Box',
        filtering: function (e) {
            var query = new ej.data.Query();
            query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
            e.updateData(datasource_1.getContacts(), query);
        }
    });
    autoToList.appendTo('#rp-autoTo');
    autoCCList = new ej.dropdowns.MultiSelect({
        dataSource: getContacts(), placeholder: '...', width: 'calc(100% - 60px)',
        cssClass: 'ac-new-mail',
        fields: { text: 'MailId', value: 'MailId' },
        popupWidth: '300px',
        hideSelectedItem: true,
        itemTemplate: '<div class="multiselect-template parent-div"><img class="contacts-item-image-style"' +
        'src="${Image}" alt="employee"/>' +
        '<div class="contacts-item-text-style"> <div> ${text} </div> </div>' +
        '<div class="contacts-item-subtext-style"> ${MailId} </div>' +
        '</div>',
        valueTemplate: '<div style="width:100%;height:100%;">' +
        '<img class="contacts-value-img-style" src="${Image}" alt="employee"/>' +
        '<div class="contacts-value-text-style"> ${MailId} </div></div>',
        mode: 'Box',
        allowFiltering: true,
        filtering: function (e) {
            var query = new ej.data.Query();
            query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
            e.updateData(datasource_1.getContacts(), query);
        }
    });
    autoCCList.appendTo('#rp-autoCc');
    toolbarMail = new ej.navigations.Toolbar({

        items: toolbarItem,
        height: '100%',
        width: '100%'
    });
    toolbarMail.appendTo('#rp-new_email_toolbar');
}
function btnRPSendClick() {
    selectedRPToolbarItem = 'SendClick';
}
function btnRPDiscardClick() {
    selectedRPToolbarItem = 'DiscardClick';
}
function renderMailMoreList() {
    var themeList = [
        { text: 'Save draft' }, { text: 'Show From' }, { text: 'Check Names' }, { text: 'Show message options' }
    ];
    var dropDownListObj = new ej.dropdowns.DropDownList({
        dataSource: themeList,
        fields: { text: 'text' },
        valueTemplate: '<div class="tb-dropdowns" style ="font-size: 16px;margin-top: -2px;">' +
        '<span class="e-btn-icon e-icons ej-icon-More"></span></div>',
        popupHeight: '150px',
        popupWidth: '150px',
        value: 'Show From',
        width: '100%'
    });
    dropDownListObj.appendTo('#rp-moreList2');
}
function toolbarReadingpaneNewMail(args) {
    if (args.item) {
        if (args.item.prefixIcon === 'ej-icon-Close tb-icons') {
            selectedRPToolbarItem = 'ClosePopup';
        }
        else if (args.item.text === 'Send' || args.item.text === 'Discard') {
            selectedRPToolbarItem = args.item.text + 'Click';
        }
    }
}
function resetRPSelectedItem(text) {
    selectedRPToolbarItem = text;
    dropdownSelectRP = false;
}
function clearMailForm() {
    if (autoCCList.value) {
        autoCCList.value = [];
    }
    if (autoToList.value) {
        autoToList.value = [];
    }
    document.getElementById('rp-txtSubject').value = '';
    document.getElementById('rp-mailContentMessage').innerHTML = '';
}
function bindReadingPaneData(selectedMessage1) {
    selectedMessage = selectedMessage1;
    document.getElementById('rp-accordian').style.display = '';
    document.getElementById('rp-mailarea').style.display = 'none';
    document.getElementById('rp-toolbar_newmail').style.display = 'none';
    document.getElementById('rp-toolbar_align').style.display = '';
    rplyToolbar.refreshOverflow();
    var key = 'ContactTitle';
    if (readAcrdnObj.items.length === 0) {
        readAcrdnObj.addItem({
            content: '#rpAccodianContent', expanded: true, header: selectedMessage[key].toString()
        });
    }
    var headerTitle = document.getElementById('rp-accordian');
    key = 'ContactTitle';
    headerTitle.getElementsByClassName('e-acrdn-header-content')[0].innerHTML = selectedMessage[key].toString();
    key = 'Image';
    headerTitle.getElementsByClassName('logo logo-style2')[0].style.background =
        'url(' + selectedMessage[key].toString().replace('styles/images/images/', 'styles/images/large/') + ')  no-repeat 50% 50%';
    key = 'text';
    document.getElementById('rp-sub').innerHTML = selectedMessage[key].toString();
    key = 'Date';
    var dateString = selectedMessage[key].toString();
    key = 'Time';
    document.getElementById('rp-date').innerHTML = dateString + ' ' + selectedMessage[key].toString();
    key = 'CC';
    document.getElementById('rp-to').innerHTML = (selectedMessage[key].toString()).replace(/,/g, ' ; ');
    key = 'Message';
    if (selectedMessage[key]) {
        document.getElementById('rp-accContent').innerHTML = selectedMessage[key].toString();
    }
    else {
        document.getElementById('rp-accContent').innerHTML =
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
function showMailDialogRP(option) {
    document.getElementById('rp-accordian').style.display = 'none';
    document.getElementById('rp-mailarea').style.display = '';
    document.getElementById('rp-toolbar_newmail').style.display = '';
    document.getElementById('rp-toolbar_align').style.display = 'none';
    clearMailForm();
    var key = '';
    readingpaneToolbarHeader.refreshOverflow();
    toolbarMail.refreshOverflow();
    if (option !== 'Forward') {
        if (option !== 'Reply') {
            key = 'CCMail';
            autoCCList.value = selectedMessage[key];
        }
        key = 'Email';
        autoToList.value = [selectedMessage[key].toString()];
    }
    key = 'ContactTitle';
    document.getElementById('rp-txtSubject').value = selectedMessage[key].toString();
    key = 'Message';
    if (selectedMessage[key]) {
        document.getElementById('rp-mailContentMessage').innerHTML = selectedMessage[key].toString();
    }
    else {
        document.getElementById('rp-mailContentMessage').innerHTML =
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


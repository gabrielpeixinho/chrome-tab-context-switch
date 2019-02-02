// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


// Called when the user clicks on the browser action.

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    if(changeInfo.url){
        commandsApi.updateCurrentContext();
        //console.log("window:"+ tab.windowId + "tab "+  tab.index + ": " + changeInfo.url);

    }

});

chrome.tabs.onRemoved.addListener( (tab) => {

    commandsApi.updateCurrentContext();

});

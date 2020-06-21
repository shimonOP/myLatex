var myLatex = {};
(function addListnenerToEditor() {
    // var elem = document.getElementById("editor");
    // elem.addEventListener('keypress', function (e) {
    //     if (e.code === "Enter") {
    //         if (e.shiftKey) {
    //             myLatex.inputToDisplay();
    //             myLatex.moveDown();

    //         }
    //     }
    // })
    editor.commands.addCommand({
        name: "inputAndMoveDown",
        bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
        exec: function (editor) {
            myLatex.inputToDisplay();
            myLatex.moveDown();
        }
    })
    editor.commands.addCommand({
        name: "inputAndMoveUp",
        bindKey: { win: "Ctrl-Shift-Enter", mac: "Command-Shift-Enter" },
        exec: function (editor) {
            myLatex.inputToDisplay();
            myLatex.moveUp();
        }
    })
    editor.commands.addCommand({
        name: "typeset",
        bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
        exec: function (editor) {
            MathJax.typeset();
        }
    })
    editor.$blockScrolling = Infinity;

})();

myLatex.maxblevel = 20;
myLatex.isMathMode = true;

myLatex.inputToDisplay = () => {
    const selectedList = document.getElementsByClassName("mathSelected")
    if (selectedList.length === 0) {
    } else if (selectedList.length === 1) {
        myLatex.editContent({ string: editor.getValue(), dom: selectedList[0] })
    }


}
myLatex.editContent = ({ string = "", dom = null } = {}) => {
    if (dom === undefined) {
        alert("dom problem")
    } else {
        // console.log(dom);
        if (dom.classList.contains("command")) {
            string = string.slice(0, 1).toUpperCase() + string.slice(1);
            // console.log(string)
            if(dom.parentNode.dataset.commandText===string){
                return
            }
            dom.parentNode.dataset.commandText = string
        } else if (dom.classList.contains("statement")) {
            if(dom.parentNode.dataset.statementText===string){
                return
            }
            dom.parentNode.dataset.statementText = string
        }
        if (myLatex.isMathMode) {
            dom.textContent = "\\[" + string + "\\]";
        } else {
            dom.textContent = string;
        }
    }
    //MathJax.typeset();

}
myLatex.createNewRowContent = ({ string = "", therow = document.getElementById("mathDisplay").lastElementChild } = {}) => {
    let blevel = 100
    if (therow === null) {
        blevel = 0
    } else {
        for (var i = 0; i < myLatex.maxblevel; i++) {
            let b = "b" + String(i)
            if (therow.classList.contains(b)) {
                blevel = i
                break;
            }
        }
    }
    if (blevel === 100) {
        alert("blevel problem")
    }
    let mathDisplay = document.getElementById("mathDisplay")
    let newCommand = document.createElement('div')
    let newStatement = document.createElement('div')
    let newOtherContent = document.createElement('div')
    let newrowContent = document.createElement('div')
    let closeButton = document.createElement('button')
    let editCommandButton = document.createElement('button')
    let editStatementButton = document.createElement('button')
    let appendNewRowButton = document.createElement('button')
    let incBlevelButton = document.createElement('button')
    let decBlevelButton = document.createElement('button')
    newCommand.classList.add('command')
    newStatement.classList.add('statement')
    newOtherContent.classList.add('otherContent')
    newrowContent.classList.add('rowContent')
    newrowContent.classList.add('b' + String(blevel))
    newrowContent.dataset.commandText = ("")
    newrowContent.dataset.statementText = ("")
    newrowContent.dataset.blevel = blevel
    newStatement.appendChild(document.createTextNode(string))
    closeButton.appendChild(document.createTextNode('×'))
    editCommandButton.appendChild(document.createTextNode('c'))
    editStatementButton.appendChild(document.createTextNode('s'))
    appendNewRowButton.appendChild(document.createTextNode('+'))
    incBlevelButton.appendChild(document.createTextNode('→'))
    decBlevelButton.appendChild(document.createTextNode('←'))
    closeButton.classList.add('closeButton')
    editCommandButton.classList.add('editCommandButton')
    editStatementButton.classList.add('editStatementButton')
    appendNewRowButton.classList.add('appendNewRowButton')
    incBlevelButton.classList.add('incBlevelButton')
    decBlevelButton.classList.add('decBlevelButton')


    closeButton.addEventListener('click', function (e) {
        e.stopPropagation();
        this.parentNode.remove();
    })
    editCommandButton.addEventListener('click', function (e) {
        e.stopPropagation();
        let selectedList = document.getElementsByClassName('mathSelected')
        if (selectedList.length === 0) {
            this.parentNode.children[0].classList.add('mathSelected')
        } else if (selectedList.length === 1) {
            selectedList[0].classList.remove('mathSelected')
            this.parentNode.children[0].classList.add('mathSelected')
        } else {
            alert('selected Problem')
        }
        editor.setValue(this.parentNode.dataset.commandText)
        editor.focus();
    })
    editStatementButton.addEventListener('click', function (e) {
        e.stopPropagation();
        let selectedList = document.getElementsByClassName('mathSelected')
        if (selectedList.length === 0) {
            this.parentNode.children[1].classList.add('mathSelected')
        } else if (selectedList.length === 1) {
            selectedList[0].classList.remove('mathSelected')
            this.parentNode.children[1].classList.add('mathSelected')
        } else {
            alert('selected Problem')
        }
        editor.setValue(this.parentNode.dataset.statementText)
        editor.focus();
    })
    appendNewRowButton.addEventListener('click', function (e) {
        e.stopPropagation();
        myLatex.createNewRowContent({ therow: this.parentNode });
    })
    incBlevelButton.addEventListener('click', function (e) {
        let blevel = parseInt(this.parentNode.dataset.blevel);
        e.stopPropagation();
        if (blevel < myLatex.maxblevel) {
            this.parentNode.classList.remove('b' + blevel)
            this.parentNode.classList.add('b' + (blevel + 1))
            this.parentNode.dataset.blevel = blevel + 1;
        }
    })
    decBlevelButton.addEventListener('click', function (e) {
        let blevel = parseInt(this.parentNode.dataset.blevel);
        e.stopPropagation();
        if (blevel > 0) {
            this.parentNode.classList.remove('b' + blevel)
            this.parentNode.classList.add('b' + (blevel - 1))
            this.parentNode.dataset.blevel = blevel - 1;
        }
    })


    newrowContent.appendChild(newCommand)
    newrowContent.appendChild(newStatement)
    newrowContent.appendChild(newOtherContent)
    newrowContent.appendChild(closeButton)
    newrowContent.appendChild(editCommandButton)
    newrowContent.appendChild(editStatementButton)
    newrowContent.appendChild(appendNewRowButton)
    newrowContent.appendChild(decBlevelButton)
    newrowContent.appendChild(incBlevelButton)
    if (therow === null) {
        mathDisplay.appendChild(newrowContent)
    } else {
        mathDisplay.insertBefore(newrowContent, therow.nextSibling)
    }
    // MathJax.typeset();
}

myLatex.moveDown = () => {
    let selectedList = document.getElementsByClassName("mathSelected");
    if (selectedList.length === 0) {
        myLatex.createNewRowContent()
        let mathDisplay = document.getElementById("mathDisplay")
        let lastrow = mathDisplay.lastElementChild
        lastrow.children[0].classList.add('mathSelected')
        editor.setValue(lastrow.dataset.commandText)
    } else if (selectedList.length === 1) {
        let theContent = selectedList[0]
        if (theContent.classList.contains("command")) {
            theContent.nextSibling.classList.add('mathSelected')
            theContent.classList.remove('mathSelected')
            //console.log(theContent.parentNode.dataset.statementText)
            editor.setValue(theContent.parentNode.dataset.statementText)
        } else {
            theContent.classList.remove('mathSelected')
            let nextRow = theContent.parentNode.nextSibling
            if (nextRow === null) {
            } else {
                nextRow.children[0].classList.add('mathSelected')
                editor.setValue(nextRow.dataset.commandText)
            }
        }

    }
}
myLatex.moveUp = () => {
    let selectedList = document.getElementsByClassName("mathSelected");
    if (selectedList.length === 0) {
        let mathDisplay = document.getElementById("mathDisplay")
        let lastrow = mathDisplay.lastElementChild
        lastrow.children[1].classList.add('mathSelected')
        editor.setValue(lastrow.dataset.statementText)
    } else if (selectedList.length === 1) {
        let theContent = selectedList[0]
        if (theContent.classList.contains("command")) {
            theContent.classList.remove('mathSelected')
            let previousRow = theContent.parentNode.previousSibling
            if (previousRow === null||previousRow.nodeName==="#text") {
            } else {
                previousRow.children[1].classList.add('mathSelected')
                editor.setValue(previousRow.dataset.statementText)
            }
        } else {
            theContent.previousSibling.classList.add('mathSelected')
            theContent.classList.remove('mathSelected')
            //console.log(theContent.parentNode.dataset.statementText)
            editor.setValue(theContent.parentNode.dataset.commandText)
        }

    }
}
myLatex.moveRight = () =>{
    let selectedList = document.getElementsByClassName("mathSelected");
    if (selectedList.length === 0) {
        let mathDisplay = document.getElementById("mathDisplay")
        let lastrow = mathDisplay.lastElementChild
        lastrow.children[1].classList.add('mathSelected')
        editor.setValue(lastrow.dataset.statementText)
    } else if (selectedList.length === 1) {
        let theContent = selectedList[0]
        if (theContent.classList.contains("command")) {
            theContent.classList.remove('mathSelected')
            let previousRow = theContent.parentNode.previousSibling
            if (previousRow === null||previousRow.nodeName==="#text") {
            } else {
                previousRow.children[1].classList.add('mathSelected')
                editor.setValue(previousRow.dataset.statementText)
            }
        } else {
            theContent.previousSibling.classList.add('mathSelected')
            theContent.classList.remove('mathSelected')
            //console.log(theContent.parentNode.dataset.statementText)
            editor.setValue(theContent.parentNode.dataset.commandText)
        }
    }
}
myLatex.clearAllButton = () => {
    let mathDisplay = document.getElementById("mathDisplay")
    let rowList = mathDisplay.children

    for (let index = 0; index < rowList.length; index++) {
        const row = rowList[index];
        const contentNum = row.children.length
        for (let j = 0; j < contentNum; j++) {
            const content = row.children[j];
            if (j !== 0 && j !== 1) {
                content.setAttribute('style', 'display: none');
            }
        }

    }

}
myLatex.clearSelectedStyle = () => {
    let selectedList = document.getElementsByClassName('mathSelected')
    for (let index = 0; index < selectedList.length; index++) {
        const element = selectedList[index];
        element.classList.remove('mathSelected')
    }
}
myLatex.clearEditTools = () => {
    myLatex.clearAllButton();
    myLatex.clearSelectedStyle();
    document.getElementById('editor').style.display = 'none'
}
myLatex.structureRows = () => {
    let mathDisplay = document.getElementById("mathDisplay")
    let rowList = mathDisplay.children;
    let mathDisplayReadOnly = document.createElement('div')
    mathDisplayReadOnly.setAttribute('id', 'mathDisplay')
    let prelevel = 0;
    let detail = mathDisplayReadOnly
    let rlength = rowList.length
    for (let index = 0; index < rlength; index++) {
        const row = rowList[0];
        const blevel = parseInt(row.dataset.blevel)
        if (blevel > 0 && blevel > prelevel) {
            let newDetail = document.createElement('details')
            let summary = document.createElement('summary')
            newDetail.appendChild(summary)
            detail.appendChild(newDetail)
            detail = newDetail
        } else if (blevel < prelevel) {
            for (let index = 0; index < prelevel - blevel; index++) {
                detail = detail.parentNode
            }
        }
        detail.appendChild(row)
        prelevel = blevel
    }
    mathDisplay.remove();
    document.body.appendChild(mathDisplayReadOnly)



}
myLatex.makeReadOnlyThisPage = () => {
    myLatex.clearEditTools();
    myLatex.structureRows();
    myLatex.openAllDetails();
    myLatex.makeAllContentRaw();
}
myLatex.unvisibleDetails = () => {
    let summaryList = document.getElementsByTagName("summary")
    for (let index = 0; index < summaryList.length; index++) {
        const element = summaryList[index];
        element.setAttribute('style', 'display:none')
    }
}
myLatex.visibleDetails = () => {
    let summaryList = document.getElementsByTagName("summary")
    for (let index = 0; index < summaryList.length; index++) {
        const element = summaryList[index];
        element.removeAttribute('style')
    }
}
myLatex.openAllDetails = () => {
    let detailsList = document.getElementsByTagName("details")
    for (let index = 0; index < detailsList.length; index++) {
        const element = detailsList[index];
        element.setAttribute('open', '')
    }
}
myLatex.makeAllContentRaw = () => {
    let rowList = document.getElementsByClassName("rowContent")
    for (let index = 0; index < rowList.length; index++) {
        const row = rowList[index];
        row.children[0].textContent = "\\[" + row.dataset.commandText + "\\]"
        row.children[1].textContent = "\\[" + row.dataset.statementText + "\\]"
    }

}
myLatex.changeEditMode = () => {
    myLatex.isMathMode = !myLatex.isMathMode
}
myLatex.makeThisPageEditable = () => {
    myLatex.destructureRows();
    myLatex.visibleAllEditTools();
}
myLatex.visibleAllEditTools = () => {
    let mathDisplay = document.getElementById("mathDisplay")
    let rowList = mathDisplay.children
    for (let index = 0; index < rowList.length; index++) {
        const row = rowList[index];
        const contentNum = row.children.length
        for (let j = 0; j < contentNum; j++) {
            const content = row.children[j];
            if (j !== 0 && j !== 1) {
                content.removeAttribute('style');
            }
        }
    }
    document.getElementById('editor').style.display = ''
}
myLatex.destructureRows = () => {
    let mathDisplay = document.getElementById("mathDisplay")
    let rowList = document.getElementsByClassName("rowContent")
    let mathDisplayEditable = document.createElement('div')
    mathDisplayEditable.setAttribute('id', 'mathDisplay')
    let rlength = rowList.length
    for (let index = 0; index < rlength; index++) {
        const row = rowList[0];
        mathDisplayEditable.appendChild(row)
    }
    mathDisplay.remove();
    document.body.insertBefore(mathDisplayEditable, document.getElementById('editor'))
}
myLatex.addEventListenerOnAllButton = () => {
    let closeButtonList = document.getElementsByClassName('closeButton')
    let editCommandButton = document.getElementsByClassName('editCommandButton')
    let editStatementButton = document.getElementsByClassName('editStatementButton')
    let appendNewRowButton = document.getElementsByClassName('appendNewRowButton')
    let incBlevelButton = document.getElementsByClassName('incBlevelButton')
    let decBlevelButton = document.getElementsByClassName('decBlevelButton')
    for (let index = 0; index < closeButtonList.length; index++) {
        const element = closeButtonList[index];
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            this.parentNode.remove();
        })
    }
    for (let index = 0; index < editCommandButton.length; index++) {
        const element = editCommandButton[index];
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            let selectedList = document.getElementsByClassName('mathSelected')
            if (selectedList.length === 0) {
                this.parentNode.children[0].classList.add('mathSelected')
            } else if (selectedList.length === 1) {
                selectedList[0].classList.remove('mathSelected')
                this.parentNode.children[0].classList.add('mathSelected')
            } else {
                alert('selected Problem')
            }
            editor.setValue(this.parentNode.dataset.commandText)
            editor.focus();
        })
    }
    for (let index = 0; index < editStatementButton.length; index++) {
        const element = editStatementButton[index];
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            let selectedList = document.getElementsByClassName('mathSelected')
            if (selectedList.length === 0) {
                this.parentNode.children[1].classList.add('mathSelected')
            } else if (selectedList.length === 1) {
                selectedList[0].classList.remove('mathSelected')
                this.parentNode.children[1].classList.add('mathSelected')
            } else {
                alert('selected Problem')
            }
            editor.setValue(this.parentNode.dataset.statementText)
            editor.focus();
        })
    }
    for (let index = 0; index < appendNewRowButton.length; index++) {
        const element = appendNewRowButton[index];
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            myLatex.createNewRowContent({ therow: this.parentNode });
        })
    }
    for (let index = 0; index < incBlevelButton.length; index++) {
        const element = incBlevelButton[index];
        element.addEventListener('click', function (e) {
            let blevel = parseInt(this.parentNode.dataset.blevel);
            e.stopPropagation();
            if (blevel < myLatex.maxblevel) {
                this.parentNode.classList.remove('b' + blevel)
                this.parentNode.classList.add('b' + (blevel + 1))
                this.parentNode.dataset.blevel = blevel + 1;
            }
        })
    }
    for (let index = 0; index < decBlevelButton.length; index++) {
        const element = decBlevelButton[index];
        element.addEventListener('click', function (e) {
            let blevel = parseInt(this.parentNode.dataset.blevel);
            e.stopPropagation();
            if (blevel > 0) {
                this.parentNode.classList.remove('b' + blevel)
                this.parentNode.classList.add('b' + (blevel - 1))
                this.parentNode.dataset.blevel = blevel - 1;
            }
        })
    }
}
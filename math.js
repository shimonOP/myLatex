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
        name: "cancelShiftEnter",
        bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
        exec: function (editor) {
            myLatex.inputToDisplay();
            myLatex.moveDown();
        }
    })

})();

myLatex.blevel = 1;

myLatex.inputToDisplay = () => {
    const selectedList = document.getElementsByClassName("mathSelected")
    if (selectedList.length === 0) {
        myLatex.createNewRowContent()
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
            console.log(string)
            dom.parentNode.dataset.commandText = string
        } else if (dom.classList.contains("statement")) {
            dom.parentNode.dataset.statementText = string
        }
        dom.textContent = "\\[" + string + "\\]";
    }
    MathJax.typeset();

}
myLatex.createNewRowContent = ({ string = "", therow = document.getElementById("mathDisplay").lastElementChild } = {}) => {
    let blevel = 100
    if (therow === null) {
        blevel = 0
    } else {
        for (var i = 0; i < 10; i++) {
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
    let newrowContent = document.createElement('div')
    let closeButton = document.createElement('button')
    let editCommandButton = document.createElement('button')
    let editStatementButton = document.createElement('button')
    let appendNewRowButton = document.createElement('button')
    let incBlevelButton = document.createElement('button')
    let decBlevelButton = document.createElement('button')
    newCommand.classList.add('command')
    newStatement.classList.add('statement')
    newrowContent.classList.add('rowContent')
    newrowContent.classList.add('b' + String(blevel))
    newrowContent.dataset.commandText = ("")
    newrowContent.dataset.statementText = ("")
    newStatement.appendChild(document.createTextNode(string))
    closeButton.appendChild(document.createTextNode('×'))
    editCommandButton.appendChild(document.createTextNode('c'))
    editStatementButton.appendChild(document.createTextNode('s'))
    appendNewRowButton.appendChild(document.createTextNode('+'))
    incBlevelButton.appendChild(document.createTextNode('→'))
    decBlevelButton.appendChild(document.createTextNode('←'))


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
        let blevel = 0;
        for (var i = 0; i < 10; i++) {
            let b = "b" + String(i)
            if (this.parentNode.classList.contains(b)) {
                blevel = i
                break;
            }
        }
        e.stopPropagation();
        if (blevel < 9) {
            this.parentNode.classList.remove('b' + blevel)
            this.parentNode.classList.add('b' + (blevel + 1))
        }
    })
    decBlevelButton.addEventListener('click', function (e) {
        let blevel = 0;
        for (var i = 0; i < 10; i++) {
            let b = "b" + String(i)
            if (this.parentNode.classList.contains(b)) {
                blevel = i
                break;
            }
        }
        e.stopPropagation();
        if (blevel > 0) {
            this.parentNode.classList.remove('b' + blevel)
            this.parentNode.classList.add('b' + (blevel - 1))
        }
    })


    newrowContent.appendChild(newCommand)
    newrowContent.appendChild(newStatement)
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
    MathJax.typeset();
}

myLatex.moveDown = () => {
    let selectedList = document.getElementsByClassName("mathSelected");
    if (selectedList.length === 0) {

    } else if (selectedList.length === 1) {
        let theContent = selectedList[0]
        if (theContent.classList.contains("command")) {
            theContent.nextSibling.classList.add('mathSelected')
            theContent.classList.remove('mathSelected')
            console.log(theContent.parentNode.dataset.statementText)
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
myLatex.clearAllButton = () => {
    let mathDisplay = document.getElementById("mathDisplay")
    let rowList = mathDisplay.children

    for (let index = 0; index < rowList.length; index++) {
        const row = rowList[index];
        const contentNum = row.children.length
        let removeNum = 0
        for (let j = 0; j < contentNum; j++) {
            const content = row.children[j - removeNum];
            if (j !== 0 && j !== 1) {
                content.remove();
                removeNum++;
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
    document.getElementById('editor').remove()
}
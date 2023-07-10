// https://qiita.com/NasuPanda/items/9c770496fe25ea0b25be
const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    // 初期化
    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        // capsLockで大文字化
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to Dom
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                })
            })
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", 
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", 
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter", 
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", 
            "space"
        ];

        // Create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };
        

        keyLayout.forEach(key =>{
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            // importance
            switch(key){
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () =>{
                        // backspaceで一文字削除
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length -1);
                        this._triggerEvent("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () =>{
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () =>{
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra--wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () =>{
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                        });
                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () =>{
                        this.close();
                        this._triggerEvent("onclose");
                        });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    // ここでクリック時のイベントを登録、valueにファンクションを代入している
                    // クリックごとに
                    keyElement.addEventListener("click", () =>{
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                        });
                    break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }
            
        });

        return fragment;
    },

    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == "function"){
            // []は参照を値でしたい、()は参照後に関数を実行する、中身は引数
            // eventHandlers[handlerName]自体がopenやcloseなのか
            // 代入されたファンクションを実行
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock(){
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys){
            // icon以外は子要素がない、基本ボタンだけを選ぶ
            if(key.childElementCount === 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose){
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },
    close(){
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

// 一番最初の関数
window.addEventListener("DOMContentLoaded", function(){
    Keyboard.init();
    // ここの引数がopen関数でeventHandlersに代入
    // Keyboard.open("dcode", function (currentValue){
    //     console.log("value changed! here it is :" + currentValue);
    // }, function(currentValue){
    //     console.log("keyboard closed! Finishing value:" + currentValue);
    // });
});



// 閉じる
    document.addEventListener('click', (e) =>{
        if(!e.target.closest('.use-keyboard-input, .keyboard')){
            Keyboard.close();
            Keyboard._triggerEvent("onclose");
        }
    });


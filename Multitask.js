class Multitask extends HTMLElement {
    constructor() {
        super();
        this._options = [];
        this._selectedOptions = [];
        this._optionLoaded = false;
        this.counter = this._selectedOptions.length;
        this.expandOptions = false;
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return [
            "option-loaded"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "option-loaded") {
            this._optionLoaded = newValue;
        }
    }

    set options(value) {
        this._options = value;
    }

    set selectedOptions(value) {
        this._selectedOptions = value;

        if (value.length === 0) {
            this.render();
            return;
        }

        if (this._optionLoaded) {
            this.render();
            this._optionLoaded = false;
        }
    }

    get options() {
        return this._options;
    }

    get selectedOptions() {
        return this._selectedOptions;
    }

    connectedCallback() {

        this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                            color: #fff;
                        }

                        label {
                            display: block;
                            font-size: 14px;
                            font-weight: 600;
                            margin-bottom: 12px;
                            color: rgba(255, 255, 255, 0.9);
                        }

                        .counter {
                            font-weight: 400;
                            color: rgba(255, 255, 255, 0.5);
                            font-size: 13px;
                            margin-left: 6px;
                        }

                        .options-group {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 12px;
                        }

                        /* Genre Item Styling (The core part) */
                        .option-item {
                            position: relative;
                            cursor: pointer;
                        }

                        /* Hide the native checkbox */
                        .option-checkbox {
                            position: absolute;
                            opacity: 0;
                            width: 0;
                            height: 0;
                        }

                        /* The visual tag */
                        .option-tag {
                            display: inline-block;
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 24px;
                            padding: 8px 18px;
                            font-size: 14px;
                            font-weight: 500;
                            color: rgba(255, 255, 255, 0.8);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            user-select: none;
                            backdrop-filter: blur(4px);
                        }

                        /* Hover & Active States */
                        .option-item:hover .option-tag {
                            background: rgba(255, 255, 255, 0.1);
                            border-color: rgba(255, 255, 255, 0.3);
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        }

                        .option-checkbox:checked + .option-tag {
                            background: #8b5cf6;
                            border-color: #8b5cf6;
                            color: white;
                            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                            transform: translateY(-1px);
                        }

                        /* Genres Grid */
                        .options-container {
                            display: flex;
                            flex-direction: column;
                            gap: 12px;
                            max-height: 100px;
                            overflow: hidden;
                            transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                            position: relative;
                        }

                        .options-container.expanded {
                            max-height: 1000px; /* Suficiente para el contenido */
                        }

                        /* Subtle fade-out effect when collapsed */
                        .options-container::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 60px;
                            background: linear-gradient(to bottom, transparent, #1e1e1e);
                            pointer-events: none;
                            transition: opacity 0.5s ease;
                            opacity: 1;
                        }

                        .options-container.expanded::after {
                            opacity: 0;
                        }

                        /* Toggle buttons */
                        .options-toggle-wrapper {
                            margin-top: 16px;
                            display: flex;
                            justify-content: flex-start;
                        }

                        .toggle-btn {
                            background: transparent;
                            border: none;
                            color: #8b5cf6;
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                            padding: 8px 0;
                            transition: all 0.3s ease;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        }

                        .toggle-btn:hover {
                            color: #a78bfa;
                            text-decoration: underline;
                        }

                        .toggle-btn[hidden] {
                            display: none;
                        }

                        /* Entrance animation for tags when expanded */
                        .options-container .option-tag {
                            opacity: 1;
                            transform: translateY(0);
                            transition: opacity 0.4s ease, transform 0.4s ease;
                        }

                        /* Efecto de cascada sutil al abrir */
                        .options-container.expanded .option-tag {
                            animation: tagEntrance 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
                        }

                        @keyframes tagEntrance {
                            from {
                                opacity: 0;
                                transform: translateY(10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        /* Estilo para los que ya estaban visibles (opcional para que no parpadeen) */
                        .options-group > .option-item:nth-child(-n+8) .option-tag {
                            animation: none;
                        }
                    </style>
                    
                        <label>Géneros <span class="counter" id="update-selectedCounter">(0
                                seleccionados)</span></label>
                    <div class="options-container" id="update-optionsContainer">
                        <div class="options-group"></div>
                    </div>
                    <div class="options-toggle-wrapper">
                        <button type="button" class="toggle-btn" id="update-expandBtn">
                            Ver más géneros +
                        </button>
                        <button type="button" class="toggle-btn" id="update-collapseBtn" hidden>
                            Mostrar menos -
                        </button>
                    </div>
                `;
        this.render();
        this.updateCounter();

        const toggleWrapper = this.shadowRoot.querySelector(".options-toggle-wrapper");
        toggleWrapper.addEventListener("click", (e) => this.handleToggleExpand(e));

        const optionsContainer = this.shadowRoot.querySelector(".options-group");
        optionsContainer.addEventListener("change", (e) => this.handleCheckboxChange(e));

    }

    handleToggleExpand(e) {
        const [expandBtn, collapseBtn] = this.shadowRoot.querySelectorAll(".toggle-btn");
        if (e.target.id === expandBtn.id) {
            expandBtn.hidden = true;
            collapseBtn.hidden = false;
        } else if (e.target.id === collapseBtn.id) {
            expandBtn.hidden = false;
            collapseBtn.hidden = true;
        }

        this.shadowRoot.querySelector(".options-container").classList.toggle("expanded");
    }


    handleCheckboxChange(event) {
        const { value: option, checked: isChecked } = event.target;

        if (!isChecked) {
            const newListOptions = this.selectedOptions.filter(options => options !== option);
            this.selectedOptions = newListOptions;
            this.updateCounter();
            return;
        }

        const newOptionsList = [...this.selectedOptions, option];
        this.selectedOptions = newOptionsList;
        this.updateCounter();
    }

    updateCounter() {
        const counter = this.shadowRoot.querySelector("#update-selectedCounter");
        this.counter = this.selectedOptions.length;
        counter.textContent = `(${this.counter} seleccionados)`;
    }

    createOption({ value, active = false }) {
        const label = document.createElement("label");
        label.className = "option-item";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "options";
        input.value = value;
        input.checked = active;
        input.className = "option-checkbox";
        const span = document.createElement("span");
        span.className = "option-tag";
        span.textContent = value;
        label.appendChild(input);
        label.appendChild(span);
        return label;
    }

    render() {
        const optionsGroup = this.shadowRoot.querySelector(".options-group");
        if (!optionsGroup) return;
        optionsGroup.innerHTML = "";
        this.counter = 0;
        const fragment = document.createDocumentFragment();
        if (this.options.length > 0) {
            this.options.forEach((option) => {
                const active = this.selectedOptions.includes(option);
                const optionElement = this.createOption({ value: option, active });
                fragment.appendChild(optionElement);
            });
            optionsGroup.appendChild(fragment);
            this.updateCounter();
        }
    }
}

window.customElements.define("multitask-element", Multitask);
import Modal from './Modal';
import API from './API';
import Ticket from './Ticket';

class HelpDesk {
    constructor(root) {
        this.root = root;
        this.list = '';
        this.addTicket = '';
        this.api = {};
        this.listTickets = []
    }

    async init() {
        this.list = 'list';
        this.addTicket = 'add-ticket';
        this.api = new API('https://ahj-rest-api.herokuapp.com/tickets');

        const list = document.querySelector('[data-help-desk=list]');
        const all = await this.api.loadAll();

        if (all.left !== 0) list.classList.remove('help-desk__list--hidden');

        all.forEach(item => this.listTickets.push(new Ticket(item, this.api)));
        this.listTickets.forEach(item => item.create(list));
    }

    _createModelForm(modal, titleHtml) {
        const title = document.createElement('h4');
        title.className =  'modal__form-title';
        title.innerHTML = titleHtml;

        const titleName = document.createElement('p');
        titleName.className =  'modal__input-title';
        titleName.innerHTML = 'Краткое описание';

        const inputName = document.createElement('input');
        inputName.className = 'modal__input';
        inputName.type = 'text';

        const labelName = document.createElement('label');
        labelName.className = 'modal__label';
        labelName.appendChild(titleName);
        labelName.appendChild(inputName);

        const titleDesc = document.createElement('p');
        titleDesc.className =  'modal__input-title';
        titleDesc.innerHTML = 'Подробное описание';

        const inputDesc = document.createElement('textarea');
        inputDesc.className = 'modal__textarea';

        const labelDesc = document.createElement('label');
        labelDesc.className = 'modal__label';
        labelDesc.appendChild(titleDesc);
        labelDesc.appendChild(inputDesc);

        const cancellation = document.createElement('input');
        cancellation.className = 'modal__button';
        cancellation.type = 'submit';
        cancellation.value = 'ОТМЕНА';
        cancellation.addEventListener('click', () => {
            modal.close();
            modal = null;
        });

        const ok = document.createElement('input');
        ok.className = 'modal__button';
        ok.type = 'submit';
        ok.value = 'ОК';

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'modal__button-wrapper';
        buttonWrapper.appendChild(cancellation);
        buttonWrapper.appendChild(ok);

        const form = document.createElement('form');
        form.className = 'modal__form';
        form.action = this.api.url;
        form.appendChild(title);
        form.appendChild(labelName);
        form.appendChild(labelDesc);
        form.appendChild(buttonWrapper);
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name = inputName;
            const desc = inputDesc;
            const classError = 'modal__error--red';
            const arrInput = [name, desc];

            let error = false;
            let body = {};

            arrInput.forEach(item => {
                if (item.value.trim() === '') {
                    error = true;
                    item.classList.add(classError);
                } else {
                    item.classList.remove(classError);
                }
            });

            if (!error) {
                body.name = name.value.trim();
                body.description = desc.value.trim();

                this.api.add(body, (res) => {
                    const list = document.querySelector('[data-help-desk=list]');

                    let ticket = new Ticket(res.data, this.api);

                    this.listTickets.push(ticket);
                    ticket.create(list);
                    ticket = null;
                });
                modal.close();
                modal = null;
            }
        });

        return form;
    }

    addModalTicket() {
        const ticket = document.querySelector(`[data-help-desk=${this.addTicket}]`);

        ticket.addEventListener('click', () => {
            const modal = new Modal();
            const modelForm = this._createModelForm(modal, 'Добавить тикет');

            modal.create(modelForm);
        });
    }
}

export default HelpDesk;

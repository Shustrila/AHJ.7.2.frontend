import Modal from './Modal';

class Ticket {
    constructor(obj, api) {
        this._id = obj.id;
        this._name = obj.name;
        this._description = obj.description;
        this._status = obj.status;
        this._created = obj.created;
        this._node = {};
        this.api = api;
    }

    _createModeEditForm(modal, contentName, contentDesc) {
        const title = document.createElement('h4');
        title.className =  'modal__form-title';
        title.innerHTML = 'Изменить Тикет';

        const titleName = document.createElement('p');
        titleName.className =  'modal__input-title';
        titleName.innerHTML = 'Краткое описание';

        const inputName = document.createElement('input');
        inputName.className = 'modal__input';
        inputName.type = 'text';
        inputName.value = this._name;

        const labelName = document.createElement('label');
        labelName.className = 'modal__label';
        labelName.appendChild(titleName);
        labelName.appendChild(inputName);

        const titleDesc = document.createElement('p');
        titleDesc.className =  'modal__input-title';
        titleDesc.innerHTML = 'Подробное описание';

        const inputDesc = document.createElement('textarea');
        inputDesc.className = 'modal__textarea';
        inputDesc.value = this._description;

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
        form.action = '/';
        form.appendChild(title);
        form.appendChild(labelName);
        form.appendChild(labelDesc);
        form.appendChild(buttonWrapper);
        form.addEventListener('submit', e => {
            e.preventDefault();

            let body = {};

            body.id = this._id;
            body.name = inputName.value;
            body.description = inputDesc.value;

            this.api.update(body, (res) => {
                const { name, description } = res.data;

                this._name = name;
                this._description = description;

                contentName.innerHTML = name;
                contentDesc.innerHTML = description;

                modal.close();
                modal = null;
            })
        });

        return form;
    }

    _createItemRemove(modal) {
        const title = document.createElement('h4');
        title.className = 'modal__form-title';
        title.innerHTML = 'Удалить тикет';

        const info = document.createElement('p');
        info.innerHTML = 'Вы уверены, что хотите удалять тикет? Это действие не обратимо.';

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
        ok.addEventListener('click', () => {
            this.api.delete(this._id, () => {
                this._node.remove();
            });

            modal.close();
            modal = null;
        });

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'modal__button-wrapper';
        buttonWrapper.appendChild(cancellation);
        buttonWrapper.appendChild(ok);

        const wrapper = document.createElement('div');
        wrapper.appendChild(title);
        wrapper.appendChild(info);
        wrapper.appendChild(buttonWrapper);

        return wrapper;
    }

    static _classStatus(status, check) {
        if (status) {
            check.classList.add('help-desk__item-check--checked');
            check.innerHTML = 'V'
        } else {
            check.classList.remove('help-desk__item-check--checked');
            check.innerHTML = ''
        }
    }

    _createItem() {
        const check = document.createElement('button');
        check.className = 'help-desk__item-check';
        check.addEventListener('click', async e => {
            e.preventDefault();

            await this.api.editStatus(this._id, (res) => {
                this._status = res.data;

                Ticket._classStatus(this._status, check);
            });

        });

        Ticket._classStatus(this._status, check);

        const contentName = document.createElement('div');
        contentName.innerHTML = this._name;
        contentName.className = 'help-desk__item-name';
        contentName.addEventListener('click', e => {
            e.preventDefault();
            contentDesc.classList.toggle('help-desk__item-description--show');
        });

        const contentDesc = document.createElement('div');
        contentDesc.innerHTML = this._description;
        contentDesc.className = 'help-desk__item-description';

        const content = document.createElement('div');
        content.className = 'help-desk__item-content';
        content.appendChild(contentName);
        content.appendChild (contentDesc);

        const date = document.createElement('p');
        date.innerHTML = this._created.full;
        date.className = 'help-desk__item-date';

        const buttonEdit = document.createElement('button');
        buttonEdit.innerHTML = 'E';
        buttonEdit.className = 'help-desk__item-button';
        buttonEdit.addEventListener('click', () => {
            const modal = new Modal();
            const content = this._createModeEditForm(modal, contentName, contentDesc);

            modal.create(content);
        });


        const buttonRemove = document.createElement('button');
        buttonRemove.innerHTML = 'R';
        buttonRemove.className = 'help-desk__item-button';
        buttonRemove.addEventListener('click', () => {
            const modal = new Modal();
            const content = this._createItemRemove(modal);

            modal.create(content);
        });

        const buttons = document.createElement('div');
        buttons.className = 'help-desk__item-buttons';
        buttons.appendChild(buttonEdit);
        buttons.appendChild(buttonRemove);

        this._node = document.createElement('li');
        this._node.className = 'help-desk__item';
        this._node.appendChild(check);
        this._node.appendChild(content);
        this._node.appendChild(date);
        this._node.appendChild(buttons);
    }

    create(root) {
        if (root === undefined || typeof root !== "object") {
            throw new Error('this root is not node DOM');
        }

        this._createItem();
        root.appendChild(this._node);
    }
}

export default Ticket;

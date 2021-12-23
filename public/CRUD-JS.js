const data = new function() {
    let inc = 0;
    const arr = {};

    this.create = (obj, callback) => {
        util.ajax({method: "POST", body: JSON.stringify(obj)}, callback);
    };
    this.getAll = (callback) => {
        util.ajax({method: "GET"}, callback);
    };
    this.get = (id, callback) => util.ajax({method: "GET", path: "/"+id}, callback);
    this.update = (obj, callback) => {
        util.ajax({method: "PUT", body: JSON.stringify(obj)}, callback);
    };
    this.delete = (id, callback) => {
        util.ajax({method: "DELETE", path: "/"+id}, callback);
    }
};

const util = new function () {
    this.ajax = (params, callback) => {
        let url = ""
        if (params.path != undefined) {
            url = params.path;
            delete params.path;
        }
        fetch("/student" + url,params).then(data => data.json()).then(callback);
    };
    this.parse = (tpl, obj) => {
        let str = tpl;
        for (let k in obj) {
            str = str.replaceAll("{" + k + "}", obj[k]);
        }
        return str;
    };
    this.id = el => document.getElementById(el);
    this.q = el => document.querySelectorAll(el);
    this.listen = (el, type, callback) => el.addEventListener(type, callback);

};

const student = new function() {
    this.submit = () => {
        const st = {
            lastname: util.id("lastname").value,
            firstname: util.id("firstname").value,
            patronymic: util.id("patronymic").value,
            phone: util.id("phone").value,
            email: util.id("email").value
        };

        if (util.id("Id").value === "-1") data.create(st, () => {this.render()});
        else {
            st.Id = util.id("Id").value;
            data.update(st, () => {this.render()});
        }
        util.id("edit").style.display = "none";
    };

    this.remove = () => {
        data.delete(activeStudent, () => {this.render();});
        activeStudent = null;
        util.id("remove").style.display = "none";
    };
    window.addEventListener("load",init);
    const init = () => {
        this.render();
        util.q(".add").forEach(el => {
            util.listen(el, "click", add);
        });
        util.q(".close").forEach(el=>{
            util.listen(el, "click", () => {
                util.id(el.dataset["id"]).style.display = "none";
            });
        });
        util.q(".submit").forEach(el => {
            util.listen(el, "click", () => {
                this[el.dataset["func"]]();
            });
        });
    };

    const add = () => {
        util.q("#edit .modal-title")[0].innerHTML = "Добавление студента";
        util.q("#edit form")[0].reset();
        util.id("Id").value = "-1";
        util.id("edit").style.display = "block";
    };

    const edit = el => {
        util.q("#edit .modal-title")[0].innerHTML = "Изменение студента";
        util.q("#edit form")[0].reset();
        data.get(el.dataset["id"], st => {
            for (let k in st) util.id(k).value = st[k];
        });
        util.id("edit").style.display = "block";
    };

    let activeStudent = null;

    const rm = el => {
        util.id("remove").style.display = "block";
        activeStudent = el.dataset["id"];
    };

    const listeners = {edit: [], rm: []};

    const clearListener = () => {
        listeners.edit.forEach(el => {
            el.removeEventListener("click", edit);
        });
        listeners.rm.forEach(el => {
            el.removeEventListener("click", rm);
        });
        listeners.edit = [];
        listeners.rm = [];
    };

    const addListener = () => {
        util.q(".edit").forEach(el =>{
            listeners.edit.push(el);
            util.listen(el, "click", () => edit(el));
        });
        util.q(".rm").forEach(el =>{
            listeners.rm.push(el);
            util.listen(el, "click", () => rm(el));
        });
    };

    this.render = () => {
        clearListener();
        data.getAll(resp => {
            util.id("table").innerHTML = resp.map(el => util.parse(tpl, el)).join("");
            addListener();
        });
    };

    const tpl = `
        <tr>
            <td></td>
		    <td>{lastname}</td>
		    <td>{firstname}</td>
		    <td>{patronymic}</td>
		    <td>{phone}</td>
		    <td>{email}</td>
		    <td>
		        <button type="button" class="btn edit" data-id="{Id}">Изменить</button>
		        <button type="button" class="btn rm" data-id="{Id}">Удалить</button>
		    </td>
		</tr>`;

    window.addEventListener("load",init);
}

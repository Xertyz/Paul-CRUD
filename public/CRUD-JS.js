const data = new function() {
    let inc = 0;
    let arr = {};
    //const init = () => {
    //  util.ajax({url: "/", method: "GET"}, resp => {
    //      arr = resp;
    //  });
    //}

    this.create = obj => {
        obj.Id = inc++;
        arr[obj.Id] = obj;
        util.ajax({method: "POST", url:"/", data: JSON.stringify(obj)});
        return obj;
    };

    this.getAll = () => {
        return Object.values(arr);
    };

    this.get = id => arr[id];

    this.update = obj => {
        arr[obj.Id] = obj;
        util.ajax({method: "PUT", url:"/", data: JSON.stringify(obj)});
        return obj;
    };

    this.delete = id => {
        delete arr[id];
    }
    //init();
};

for (let num = 13; num < 18; num++) {
    data.create({
        lastname: "Бурбон",
        firstname: "Людовик " + num,
        patronymic: "Людовик " + (num-1),
        phone: "0000",
        email: "luvr" + num + "@france.com"
    });
}

const util = new function () {
    this.ajax = (params, callback) => {
        fetch(params).then(data => data.toJson()).then(callback);
    }
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

        if (util.id("Id").value === "-1") data.create(st);
        else {
            st.Id = util.id("Id").value;
            data.update(st);
        }
        this.render();
        util.id("edit").style.display = "none";
    };

    this.remove = () => {
        data.delete(activeStudent);
        activeStudent = null;
        this.render();
        util.id("remove").style.display = "none";
    };

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
        const st = data.get(el.dataset["id"]);
        for (let k in st) util.id(k).value = st[k];
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
        util.id("table").innerHTML = data
            .getAll()
            .map(el => util.parse(tpl, el)).join("");
        addListener();
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
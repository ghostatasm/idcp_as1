const handleDomo = (e, csrf) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoSize").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer(csrf);
    });

    return false;
};

const handleDomoDelete = (e, id, csrf) => {
    sendAjax('DELETE', `/deleteDomo?id=${id}`, `_csrf=${csrf}`, () => {
        loadDomosFromServer(csrf);
    });
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.csrf)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="size">Size: </label>
            <input id="domoSize" type="text" name="size" placeholder="Domo Size" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map((domo) => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoSize">Size: {domo.size}</h3>
                <button className="domoDelete" onClick={(e) => handleDomoDelete(e, domo._id, props.csrf)}>Delete</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', `_csrf=${csrf}`, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf} />,
            document.querySelector("#domos")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />,
        document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf} />,
        document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(() => {
    getToken();
});
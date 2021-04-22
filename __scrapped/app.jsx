// Functionalities
const handle = (e, csrf) => {
    e.preventDefault();

    $("#Message").animate({ width: 'hide' }, 350);

    if ($("#Name").val() == '' || $("#Age").val() == '' || $("#Size").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#Form").attr("action"), $("#Form").serialize(), () => {
        loadsFromServer(csrf);
    });

    return false;
};

const handleDelete = (e, id, csrf) => {
    sendAjax('DELETE', `/delete?id=${id}`, `_csrf=${csrf}`, () => {
        loadsFromServer(csrf);
    });
}

// React components
const Form = (props) => {
    return (
        <form id="Form"
            onSubmit={(e) => handle(e, props.csrf)}
            name="Form"
            action="/maker"
            method="POST"
            className="Form"
        >
            <label htmlFor="name">Name: </label>
            <input id="Name" type="text" name="name" placeholder=" Name" />
            <label htmlFor="age">Age: </label>
            <input id="Age" type="text" name="age" placeholder=" Age" />
            <label htmlFor="size">Size: </label>
            <input id="Size" type="text" name="size" placeholder=" Size" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSubmit" type="submit" value="Make " />
        </form>
    );
};

const List = (props) => {
    if (props.s.length === 0) {
        return (
            <div className="List">
                <h3 className="empty">No s yet</h3>
            </div>
        );
    }

    const Nodes = props.s.map(() => {
        return (
            <div key={._id} className="">
                <img src="/assets/img/face.jpeg" alt=" face" className="Face" />
                <h3 className="Name">Name: {.name}</h3>
                <h3 className="Age">Age: {.age}</h3>
                <h3 className="Size">Size: {.size}</h3>
                <button className="Delete" onClick={(e) => handleDelete(e, ._id, props.csrf)}>Delete</button>
            </div>
        );
    });

    return (
        <div className="List">
            {Nodes}
        </div>
    );
};

// React component factories
const loadsFromServer = (csrf) => {
    sendAjax('GET', '/gets', `_csrf=${csrf}`, (data) => {
        ReactDOM.render(
            <List s={data.s} csrf={csrf} />,
            document.querySelector("#s")
        );
    });
};

// Init
const init = () => {
    ReactDOM.render(
        <Form csrf={csrf} />,
        document.querySelector("#make")
    );

    ReactDOM.render(
        <List s={[]} csrf={csrf} />,
        document.querySelector("#s")
    );

    loadsFromServer(csrf);
};
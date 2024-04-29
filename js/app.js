

let cl = console.log;



const showProductModel = document.getElementById("showProductModel");
const backDrop = document.getElementById("backDrop");
const productModel = document.getElementById("productModel");
const productContainer = document.getElementById("productContainer");
const hideProductModel = document.querySelectorAll(".hideProductModel");
const loader = document.getElementById("loader");
const titleControl = document.getElementById("title");
const imageUrlControl = document.getElementById("imageUrl");
const descriptionControl = document.getElementById("description");
const ratingControl = document.getElementById("rating");
const statusControl = document.getElementById("status");
const productForm = document.getElementById("productForm");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");







let baseUrl = `https://product-mt-5-asyncawait-default-rtdb.asia-southeast1.firebasedatabase.app`;
let productUrl = `https://product-mt-5-asyncawait-default-rtdb.asia-southeast1.firebasedatabase.app/productArr.json`;

const snackbarMsg = (msg, icon, timer) => {
    swal.fire({
        title: msg,
        icon: icon,
        timer: timer
    })
}

const objToArr = (obj) => {
    let productArr = [];
    for (let key in obj) {
        productArr.push({ ...obj[key], id: key })
    }
    return productArr
}


const loaderStart = () => {
    loader.classList.remove("d-none");
}
const loaderStop = () => {
    loader.classList.add("d-none");
}
const makeApiCall = async (apiUrl, methodName, msgBody) => {
    loaderStart();
    try {
        msgBody = msgBody ? JSON.stringify(msgBody) : null;
        let res = await fetch(apiUrl, {
            method: methodName,
            body: msgBody
        })
        return res.json()
    }
    catch (err) {
        cl(err)
        snackbarMsg("Something went wrong while fetching products!!", "error", 1500)
    }
    finally {
        loaderStop();
    }

}

const fetchProduct = async () => {
    try {
        let res = await makeApiCall(productUrl, "GET", null);
        cl(res)
        let data = objToArr(res);
        productTemplating(data.reverse());
    }
    catch (err) {
        cl(err)
    }
}
fetchProduct();

const productTemplating = (obj) => {
    productContainer.innerHTML = obj.map(ele => {
        return `<div class="col-md-4 mb-4">
                    <div class="card mt-4">
                    <figure class="productCard mb-0" id=${ele.id}>
                        <div class="productImg">
                            <img src="${ele.imageUrl}"
                                alt="img" title="img">
                        </div>
                        <figcaption>
                            <div class="ratingSec text-center">
                                <div class="productName">
                                    <h4 class="mb-0">${ele.title}</h4>
                                </div>
                                <div class="rating">
                                    ${ele.rating > 3 ? `<p class="mb-0 text-success">${ele.rating}<i class="fa-solid fa-star text-success"></i></p>` :
                ele.rating >= 2 && ele.rating <= 3 ? `<p class="mb-0 text-warning">${ele.rating}<i class="fa-solid fa-star text-warning"></i></p>` :
                    `<p class="mb-0 text-danger">${ele.rating}<i class="fa-solid fa-star text-danger"></i></p>`}
                               
                                </div>
                                <div class="status">
                                ${ele.status === `Delivered!!!` ? `<p class="mb-0 bg-success"><strong>${ele.status}</strong></p>` :
                ele.status === `Unsuccessful Delivery Attempt!!!` ? `<p class="mb-0 bg-danger"><strong>${ele.status}</strong></p>` :
                    `<p class="mb-0 bg-warning"><strong>${ele.status}</strong></p>`}
                                    
                                </div>
                            </div>                              
                            <div class="overviewSec">
                                <h4>${ele.title}</h4>
                                <em>Overview</em>
                                <p>
                                ${ele.description}
                                </p>

                                <div class="action">
                                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                    <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                                </div>

                            </div>
                        </figcaption>
                    </figure>
                    </div>
                    
                </div>`
    }).join("")
}

const onEdit = async (ele) => {
    try {
        
        let editId = ele.closest(".productCard").id;
        localStorage.setItem("editId", editId);
        let editUrl = `${baseUrl}/productArr/${editId}.json`;
        let res = await makeApiCall(editUrl, "GET", null)
        titleControl.value = res.title;
        imageUrlControl.value = res.imageUrl;
        ratingControl.value = res.rating;
        descriptionControl.value = res.description;
        statusControl.value = res.status;
        productModelToggle();
        submitBtn.classList.add("d-none");
        updateBtn.classList.remove("d-none");        
    }
    catch (err) {
        cl(err)
        snackbarMsg("Something went wrong while fetching product data!!", "error", 1500)
    }    
}


const updateCard = (obj) => {
    let card = [...document.getElementById(obj.id).children];
    cl(card)
    card[0].innerHTML = `
                            <img src="${obj.imageUrl}"
                                alt="img" title="img">`;

    card[1].innerHTML = `<div class="ratingSec text-center">
                            <div class="productName">
                                <h4 class="mb-0">${obj.title}</h4>
                            </div>
                            <div class="rating">
                                ${obj.rating > 3 ? `<p class="mb-0 text-success">${obj.rating}<i class="fa-solid fa-star text-success"></i></p>` :
                                obj.rating >= 2 && obj.rating <= 3 ? `<p class="mb-0 text-warning">${obj.rating}<i class="fa-solid fa-star text-warning"></i></p>` :
                         `<p class="mb-0 text-danger">${obj.rating}<i class="fa-solid fa-star text-danger"></i></p>`}
                        
                            </div>
                            <div class="status">
                            ${obj.status === `Delivered!!!` ? `<p class="mb-0 bg-success"><strong>${obj.status}</strong></p>` :
            obj.status === `Unsuccessful Delivery Attempt!!!` ? `<p class="mb-0 bg-danger"><strong>${obj.status}</strong></p>` :
                `<p class="mb-0 bg-warning"><strong>${obj.status}</strong></p>`}
                                
                            </div>
                        </div>                              
                        <div class="overviewSec">
                            <h4>${obj.title}</h4>
                            <em>Overview</em>
                            <p>
                            ${obj.description}
                            </p>

                            <div class="action">
                                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                            </div>

                        </div>`;

}
const onUpdateBtn = async () => {
    try {
        let updateId = localStorage.getItem("editId");
        let updateUrl = `${baseUrl}/productArr/${updateId}.json`;;
        let updateObj = {
            title: titleControl.value,
            imageUrl: imageUrlControl.value,
            rating: ratingControl.value,
            status: statusControl.value,
            description: descriptionControl.value,
            id: updateId
        }
        let res = await makeApiCall(updateUrl, "PATCH", updateObj)
        cl(res)
        updateCard(res);
        snackbarMsg("Product Details Updated successfully!!! ", "success", 1500);
    }
    catch (err) {
        cl(err)
    }
    finally {
        updateBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");
        productForm.reset();
        productModelToggle();

    }
}

const onDelete = async (ele) => {
    try {
        let getConfirmation = await swal.fire({
            title: "Are you sure, You want to delete this product?",
            showCancelButton: true,
            confirmButtoText: "Delete"
        })
        if (getConfirmation.isConfirmed) {
            let deleteId = ele.closest(".productCard").id;
            let deleteUrl = `${baseUrl}/productArr/${deleteId}.json`;
            let res = await makeApiCall(deleteUrl, "DELETE", null)
            ele.closest(".col-md-4").remove();
            snackbarMsg("Product deleted successfully!!!", "success", 1500)
        }
    }
    catch (err) {
        cl(err)
        snackbarMsg("something went wrong while deleting product!!", "error", 1500)
    }
}

const createCard = (obj) => {
    let card = document.createElement("div");
    card.className = "col-md-4 mb-0";
    card.innerHTML = `<div class="card mt-4">
                        <figure class="productCard mb-0" id=${obj.id}>
                            <div class="productImg">
                                <img src="${obj.imageUrl}"
                                    alt="img" title="img">
                            </div>
                            <figcaption>
                                <div class="ratingSec text-center">
                                    <div class="productName">
                                        <h4 class="mb-0">${obj.title}</h4>
                                    </div>
                                    <div class="rating">
                                        ${obj.rating > 3 ? `<p class="mb-0 text-success">${obj.rating}<i class="fa-solid fa-star text-success"></i></p>` :
            obj.rating >= 2 && obj.rating <= 3 ? `<p class="mb-0 text-warning">${obj.rating}<i class="fa-solid fa-star text-warning"></i></p>` :
                `<p class="mb-0 text-danger">${obj.rating}<i class="fa-solid fa-star text-danger"></i></p>`}
                                
                                    </div>
                                    <div class="status">
                                    ${obj.status === `Delivered!!!` ? `<p class="mb-0 bg-success"><strong>${obj.status}</strong></p>` :
            obj.status === `Unsuccessful Delivery Attempt!!!` ? `<p class="mb-0 bg-danger"><strong>${obj.status}</strong></p>` :
                `<p class="mb-0 bg-warning"><strong>${obj.status}</strong></p>`}
                                        
                                    </div>
                                </div>                              
                                <div class="overviewSec">
                                    <h4>${obj.title}</h4>
                                    <em>Overview</em>
                                    <p>
                                    ${obj.description}
                                    </p>

                                    <div class="action">
                                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                                    </div>

                                </div>
                            </figcaption>
                        </figure>
                        </div>`;

    productContainer.prepend(card)

}
const onproductForm = async (eve) => {
    try {
        eve.preventDefault();
        let newProduct = {
            title: titleControl.value,
            imageUrl: imageUrlControl.value,
            rating: ratingControl.value,
            status: statusControl.value,
            description: descriptionControl.value
        };
        cl(newProduct)
        let res = await makeApiCall(productUrl, "POST", newProduct)
        cl(res)
        newProduct.id = res.name;
        createCard(newProduct);
        snackbarMsg("New Product Added Successfully!!", "success", 1500);
    }
    catch (err) {
        cl(err)
        snackbarMsg("Something went wrong while adding product!!", "error", 1500);
    }
    finally {
        productModelToggle();
        productForm.reset();
    }

}


const productModelToggle = () => {
    backDrop.classList.toggle("active");
    productModel.classList.toggle("active");    
}

const onCancel = ()=>{
    productForm.reset();
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
}



hideProductModel.forEach(ele => {
    ele.addEventListener("click", productModelToggle)
})
productForm.addEventListener("submit", onproductForm)
showProductModel.addEventListener("click", productModelToggle)
updateBtn.addEventListener("click", onUpdateBtn)
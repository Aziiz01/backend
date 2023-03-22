import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs"

export const getProducts = async(req,res)=> {
try {
    const response = await Product.findAll();
    res.json(response);
} catch (error) {
    console.log(error.message);
}
}
export const getProductById = async (req,res)=> {
try {
    const response = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    res.json(response);
} catch (error) {
    console.log(error.message);
}
}
export const saveProduct = (req,res)=> {
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const nom = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];
   const description = req.body.description;
   const rating = req.body.rating;
   const prix = req.body.prix;

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images!!"})
    if(fileSize> 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
    file.mv(`./public/images/${fileName}`,async(err)=>{
        if (err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({
                nom: nom,
                image: fileName,
                url: url,
                description: description,
                rating : rating,
                prix : prix
            });
                        res.status(201).json({msg: "Product Created Successfully"});
        } catch (error) {
        console.log(error.message);
        }
    })
}
export const updateProduct =async (req,res)=> {
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg:"no data found!!!"});
    let fileName="";
    if(req.files === null) {
        fileName = Product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images!!"})
        if(fileSize> 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
        }
        const nom = req.body.title;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const description = req.body.description;
        const rating = req.body.rating;
        const prix = req.body.prix;
        try {
            await Product.update({nom: nom,
                image: fileName,
                url: url,
                description: description,
                rating : rating,
                prix : prix }, {
                    where:{
                        id: req.params.id 
                    }
                });
                res.status(200).json({msg: "Product Uploaded Successfully"});
        } catch (error) {
            console.log(error.message);
        }
}
export const deleteProduct = async (req,res)=> {
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!product) return res.status(404).json({msg: "No Data Found!"});
    try {
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg:"Product deleted successfully!"});
    } catch (error) {
        console.log(error.message);
    }
}
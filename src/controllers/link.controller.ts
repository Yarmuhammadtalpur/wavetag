import { NextFunction, Request, Response } from 'express';
import Link from '../models/link.model';
import asyncHandler from 'express-async-handler';
import { DeletedLinkType, LinkDocument, LinkType } from '../types/link.types';

/**
 * Creates a new link with the provided information if no link with the same name or link URL
 * already exists in the database, and returns a JSON response with the status and link details.
 *
 * @async
 * @function createLink
 * @param {Request} req - The Express Request object containing link information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Item already exists. Choose a different name, link.'
 *   if a link with the same name or link URL already exists.
 * @returns {Promise<void>} A promise that resolves once the link is successfully created and saved to the database.
 *   The HTTP response includes a JSON object with a message, status, and link information.
 */
const createLink = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, link, icon }: LinkType = req.body as LinkType;

    const existingLink: LinkType | null = await Link.findOne({ $or: [{ name }, { link }] });

    if (existingLink) {
        res.status(400);
        throw new Error('Item already exists. Choose a different name, link.');
    }

    const newlink: LinkDocument = new Link({
        name,
        link,
        icon
    });

    const savedLink: LinkType = await newlink.save();

    res.status(201).json({  message: "Link Created",status: "success",data: savedLink });
});

/**
 * Retrieves information for a link with the specified linkId and returns a JSON response with the status
 * and link details if the link is found in the database. If the link is not found, it throws an error
 * with a message 'No Information found for provided Link' and returns a 404 status in the HTTP response.
 *
 * @async
 * @function readLink
 * @param {Request} req - The Express Request object containing the linkId parameter.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No Information found for provided Link' if the link
 *   with the specified linkId is not found in the database.
 * @returns {Promise<void>} A promise that resolves once the link information is successfully retrieved
 *   and sent in the HTTP response. The response includes a JSON object with a message, status, and link details.
 */
const readLink = asyncHandler(async (req: Request, res: Response) => {
    const linkId:string = req.params.linkId;

    const foundlink: LinkType | null = await Link.findById(linkId);

    if (foundlink) {
        res.status(200).json({ message: "Link found", status: "success",data:foundlink });
    } else {
        res.status(404);
        throw new Error('No Information found for provided Link');
    }
});

/**
 * Handles the request to retrieve all links from the database.
 *
 * @async
 * @function readAllLinks
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 *
 *
 * @description
 * This function uses the Link model to fetch all links from the database and sends a JSON response with the links.
 * If no links are found, an empty array is returned in the response.
 *
 */
const readAllLinks = asyncHandler(async (req: Request, res: Response) => {
    const links: LinkDocument[] | null = await Link.find();

    if (links.length === 0) {
        res.status(404);
        throw new Error('No Links found');
    }

    res.status(200).json({ status: "success", data: links || [] });
})

/**
 * Update a link's information based on the provided link ID. The update is performed if the new name and link
 * do not conflict with existing entries in the database. Returns a JSON response with the updated link details.
 *
 * @async
 * @function updateLink
 * @param {Request} req - The Express Request object containing the updated link information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No information found for the provided Link' and a 404 status
 *   if no link is found in the database with the provided link ID.
 * @throws {Error} Throws an error with a message 'Item already exists. Choose a different name, link.' and a 400 status
 *   if the provided name or link already exists in the database.
 * @throws {Error} Throws an error with a message 'Name and link are required in the request body' and a 400 status
 *   if the request body is missing either the name or link property.
 * @returns {Promise<void>} A promise that resolves once the link is successfully updated and sent as a JSON response
 *   with a 200 status.
 */
const updateLink = asyncHandler(async (req: Request, res: Response) => {
    const linkId: string = req.params.linkId;

    const link: LinkDocument | null = await Link.findById(linkId);

    if (link) {
        const { name, link: url , icon } = req.body;

        if (name || url) {
          const existingLink: LinkType | null = await Link.findOne({
            $or: [
              { name, _id: { $ne: linkId } },
              { link: url, _id: { $ne: linkId } },
            ],
          });

          if (existingLink) {
            let errorMessage: string = "";

            if (existingLink.name === name) {
              errorMessage = "Name already exists";
            } else if (existingLink.link === url) {
              errorMessage = "Url already exists";
            }

            res.status(400);
            throw new Error(errorMessage);
          }
        }

        link.name = name || link.name;
        link.link = url || link.link;
        link.icon = icon || link.icon;

        await link.save();

        res.status(200).json({ message: "Link updated", status: "success", data: link });
    } else {
        res.status(404);
        throw new Error('No information found for the provided Link');
    }
});


/**
 * Delete a link based on the provided link ID.
 *
 * @async
 * @function deleteLink
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No Information found for provided Link' and a 404 status
 *   if no link is found in the database with the provided link ID.
 * @returns {Promise<void>} A promise that resolves once the link is successfully deleted and sent as a JSON response
 *   with a 200 status, including the deleted link information and a 'Deleted' message.
 *
 * @description The `lean()` method is used to return a plain JavaScript object instead of a Mongoose Document
 *   when querying the database. This can improve performance by skipping the instantiation of full Mongoose documents,
 *   resulting in a more lightweight result. However, keep in mind that using `lean()` means you won't have access to
 *   Mongoose document methods or features.
 */
const deleteLink = asyncHandler(async (req: Request, res: Response) => {
    const linkId: string = req.params.linkId;
    
    const deletedlink: DeletedLinkType | null = await Link.findByIdAndDelete(linkId).lean();

    if (deletedlink) {
        res.status(200).json({ message: "Link deleted", status: "success" });
    } else {
        res.status(404);
        throw new Error('No Information found for provided Link');
    }
});

export default { createLink, readLink, readAllLinks, updateLink, deleteLink };
// API for fetching the route txn data.
import { NextApiRequest, NextApiResponse } from 'next';

// base url for the cross-chain end point.
const BASE_URL = "https://bridge-swap.aarc.xyz/bridge-swap";

// AARC API Key. Get it from here: https://dashboard.aarc.xyz/
const AARC_API_KEY = process.env.AARC_API_KEY ? process.env.AARC_API_KEY : "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        route
    } = req.body;

    const endPoint = `${BASE_URL}/route-transaction-data/`;

    let response;
    let responseInJson;

    try {
        response = await fetch(endPoint, {
            method: "POST",
            headers: {
                "x-api-key": AARC_API_KEY,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ route: route }),
        });
    } catch (error) {
        console.error("Error fetching Quote data:", error);
    }

    if (response != undefined) {
        try {
            responseInJson = await response.json();
        } catch (error) {
            console.error("Error parsing JSON response:", error);
        }
    }
    res.status(200).json({ responseInJson });
}
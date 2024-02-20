
// API for fetching the data from the quote endpoint

import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = "https://bridge-swap.aarc.xyz/bridge-swap";

const AARC_API_KEY = process.env.AARC_API_KEY ? process.env.AARC_API_KEY : "";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        chainId, owner, allowanceTarget, tokenAddress, amount
    } = req.query;

    const queryParams = new URLSearchParams({
        chainId: chainId as string,
        owner: owner as string,
        allowanceTarget: allowanceTarget as string,
        tokenAddress: tokenAddress as string,
        amount: amount as string
    });


    const endPoint = `${BASE_URL}/approval-transaction-data?${queryParams}`;

    let response;
    let responseInJson;
    let approvalTxData;

    try {
        response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "x-api-key": AARC_API_KEY,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching Approval Tx data:", error);
    }

    if (response != undefined) {
        try {
            responseInJson = await response.json();
            if (responseInJson.success === true)
                approvalTxData = responseInJson.result;
            else
                console.error("Error fetching Quote data:", responseInJson);
        } catch (error) {
            console.error("Error parsing JSON response:", error);
        }
    }

    res.status(200).json({ approvalTxData });
}
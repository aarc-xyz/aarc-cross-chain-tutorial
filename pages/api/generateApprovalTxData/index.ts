// API for generating the approval transaction data.
import { NextApiRequest, NextApiResponse } from 'next';

// base url for the cross-chain end point.
const BASE_URL = "https://bridge-swap.aarc.xyz/bridge-swap";

// AARC API Key. Get it from here: https://dashboard.aarc.xyz/
const AARC_API_KEY = process.env.AARC_API_KEY ? process.env.AARC_API_KEY : "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        chainId, owner, allowanceTarget, tokenAddress, amount
    } = req.query;

    const queryParams = new URLSearchParams({
        chainId: chainId as string, // Source network chainId
        owner: owner as string, // Address of the owner of the token
        allowanceTarget: allowanceTarget as string, // Address of the spender
        tokenAddress: tokenAddress as string, // Address of the token
        amount: amount as string // The amount of token allowance to be set
    });

    // The final endpoint
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
            if (responseInJson.success === true) {
                approvalTxData = responseInJson.result;
                console.log(
                    "Approval Tx Data", approvalTxData
                )
            }
            else
                console.error("Error fetching Approval tx data:", responseInJson);
        } catch (error) {
            console.error("Error parsing JSON response:", error);
        }
    }

    res.status(200).json({ approvalTxData });
}
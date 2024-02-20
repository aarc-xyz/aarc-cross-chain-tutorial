import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = "https://bridge-swap.aarc.xyz/bridge-swap"; // base url for the cross-chain end point.

const AARC_API_KEY = process.env.AARC_API_KEY ? process.env.AARC_API_KEY : "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        recipient, routeType, fromChainId, fromTokenAddress, toChainId, toTokenAddress, fromAmount, userAddress
    } = req.query;

    const queryParams = new URLSearchParams({
        recipient: recipient as string, // receiver address
        routeType: routeType as string, // criteria to sort the routes
        fromChainId: fromChainId as string, // source network chainId
        fromTokenAddress: fromTokenAddress as string, // source token address on the source network
        toChainId: toChainId as string, // destination network chainId
        toTokenAddress: toTokenAddress as string, // destination token address on the destination network
        fromAmount: fromAmount as string, // amount of token of `fromTokenAddress`
        userAddress: userAddress as string // the owner of the token of `fromTokenAddress`
    });

    const endPoint = `${BASE_URL}/quote?${queryParams}`; // final end point for the API

    let response;
    let responseInJson;
    let route;

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
        console.error("Error fetching Quote data:", error);
    }

    if (response != undefined) {
        try {
            responseInJson = await response.json();
            if (responseInJson.success === true)
            // selecting the first route from the array of routes
            {
                route = responseInJson.result.routes[0];
            }
            else
                console.error("Error fetching Quote data:", responseInJson);
        } catch (error) {
            console.error("Error parsing JSON response:", error);
        }
    }

    res.status(200).json({ route });
}
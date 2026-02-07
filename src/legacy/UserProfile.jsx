/**
 * LEGACY: NFT-based UserProfile component from NeptuneChain era.
 * Moved to src/legacy/ -- references undefined NFT_CONTRACT_ADDRESS and ethers globals.
 * This file is preserved for reference only and should not be imported.
 */

import { useEffect, useState } from "react";

const  UserProfile = ({ signer }) => {
    const [userNFTs, setUserNFTs] = useState([]);

    useEffect(() => {
        async function fetchUserNFTs() {
            if (!signer) return;

            const userAddress = await signer.getAddress();
            const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
            const nftCount = await nftContract.balanceOf(userAddress);
            const _nfts = [];

            for (let i = 0; i < nftCount; i++) {
                const nftId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
                const nft = await nftContract.tokenURI(nftId);
                _nfts.push(nft);
            }

            setUserNFTs(_nfts);
        }

        fetchUserNFTs();
    }, [signer]);

    return (
        <div>
            {userNFTs.map((nft) => (
                <div key={nft.id}>
                    <img src={nft.imageURL} alt={nft.name} />
                    <h3>{nft.name}</h3>
                </div>
            ))}
        </div>
    );
}

export default UserProfile;

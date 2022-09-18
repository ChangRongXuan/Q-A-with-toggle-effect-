import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import Head from "next/head";

export default function QA({ launches }) {
    const [qaDetail, setQaDetail] = useState("qa-list-detail-none");

    // 有展開的會加入陣列 - 號
    const [toggleBtn, setToggleBtn] = useState([]);

    return (
        <>
            <div className="qa-wrap">
                <h2>你可能還想知道</h2>

                {launches.map((v, i) => {
                    return (
                        <div
                            id={v.id}
                            className="qa-list"
                            key={v.id}
                            onClick={(e) => {
                                const answerId = document.getElementById(
                                    v.question
                                );

                                if (
                                    answerId.className == "qa-list-detail-none"
                                ) {
                                    answerId.className = "qa-list-detail-block";
                                    const newToggleBtn = [
                                        ...toggleBtn,
                                        e.currentTarget.id,
                                    ];
                                    setToggleBtn(newToggleBtn);
                                } else {
                                    answerId.className = "qa-list-detail-none";
                                    const newToggleBtn = toggleBtn.filter(
                                        (v) => v != e.currentTarget.id
                                    );
                                    setToggleBtn(newToggleBtn);
                                }
                            }}
                        >
                            <div className="qa-list-title">
                                <p>{v.question}</p>

                                <div>
                                    {toggleBtn.includes(v.id) ? (
                                        <AiOutlineMinus />
                                    ) : (
                                        <AiOutlinePlus />
                                    )}
                                </div>
                            </div>

                            <div className={qaDetail} id={v.question}>
                                <p>{v.answer}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export async function getStaticProps() {
    const client = new ApolloClient({
        uri: "https://editools-bibo-homework-4g6paft7cq-de.a.run.app/api/graphql",
        cache: new InMemoryCache(),
    });

    const { data } = await client.query({
        query: gql`
            query {
                qas {
                    items {
                        id
                        question
                        answer
                    }
                }
            }
        `,
    });

    return {
        props: {
            launches: data.qas[0].items,
        },
    };
}

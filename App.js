// "StAuth10244: I Jonghwan Lee, 000811948, certify that this material is my original work. Noother person's work has been used without due acknowledgement. I have notmade my work available to anyone else."

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Image} from 'react-native';


const App = () => {
    
    const [todayQuote, setTodayQuote] = useState({});
    const [tags, setTags] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [quotes, setQuotes] = useState([]);
    const [quotesSearchResult, setQuotesSearchResult] = useState("");
    const [textInputRef, setTextInputRef] = useState("");
    const [selectedTagId, setSelectedTagId] = useState("");
    
    const baseUrl = "http://api.quotable.io/";

    const getRandom = async () => {
        try {
            const response = await fetch(baseUrl + "random");
            const json = await response.json();
            setTodayQuote({author: json.author, quote: json.content});
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(getRandom, []);

    const getTags = async () => {
        try {
            const response = await fetch(baseUrl + "tags");
            const json = await response.json();
            setTags(json);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(getTags, []);

    const getQuotesByTag = async (tag) => {
        setSelectedTagId(tag._id); 
        textInputRef.clear();

        try {
            const response = await fetch(baseUrl + "search/quotes?query=" + tag.name + "&fields=tags");
            const json = await response.json();
            setQuotes(json.results);
            setSearchResult(json.results.length);
        } 
        catch (error) {
            console.log(error);
        }
    };

    const getQuotesByKeyword = async () => {
        setSelectedTagId("");
        
        try {
            const response = await fetch(baseUrl + "search/quotes?query="+ keyword);
            const json = await response.json();
            setQuotes(json.results);
            setSearchResult(json.results.length);
        } 
        catch (error) {
            console.log(error);
        }
    };

    const setSearchResult = (length) => {
        let result = "";
        if (length === 0)
            result = "No quotes found.";
        else if (length === 1)
            result = "1 quote found.";
        else 
            result = length + " quotes found.";

        setQuotesSearchResult(result);
    };


    const renderTags = (tag) => {
        const tagStyle = tag._id === selectedTagId ? styles.tagSelected : styles.tagUnselected;
        return (
            <TouchableOpacity onPress={() => getQuotesByTag(tag)} key={tag._id}>
                <View style={styles.tag}>
                    <Text style={[styles.tagText, tagStyle]}>{tag.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderQuoteView = (author, quote) => {
        return (
            <View style={styles.quoteView}>
                <Text style={styles.quote}>
                    "{quote}"<Text style={styles.author}>  {author}</Text>
                </Text>
            </View>
        );
    };

    const renderMain = () => {
        return (
            <View>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.title}>Get inspired!</Text>
                    <Image style={styles.topImage} source={require("./assets/inspiration.jpg")} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Today's Quote</Text>
                    {renderQuoteView(todayQuote.author, todayQuote.quote)}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get more quotes</Text>
                    <Text style={[styles.sectionTitle,{fontSize: 12}]}>Select a tag or search with keyword</Text>
                    <View style={styles.tags}>
                        {tags.map(tag => renderTags(tag))}
                    </View>
                    <View style={styles.input}>
                        <TextInput style={styles.inputText}
                            placeholder="e.g. home, school, etc."
                            onChangeText={text => setKeyword(text)}
                            ref={value => setTextInputRef(value)}/>
                        <Button 
                            title="Search"
                            onPress={() => getQuotesByKeyword()}/>
                    </View>
                    <Text style={styles.result}>{quotesSearchResult}</Text>
                </View>
            </View>
        );
    };

    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>Copyright(c) 2021 Jonghwan Lee</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={renderMain()}
                ListFooterComponent={renderFooter()}
                data={quotes}
                renderItem={({item}) => renderQuoteView(item.author, item.content)}
                keyExtractor={item => item._id}
            />
        </View>
  );

}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 4
    },
    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'serif',
        fontStyle: 'italic'
    },
    topImage: {
        width: '90%', 
        height: 200,
        marginTop: 30
    },
    section: {
        marginTop: 40,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    sectionTitle: {
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'monospace'
    },
    tags: {
        marginTop: 18,
        flexDirection: "row", 
        flexWrap: "wrap"
    },
    tagUnselected: {
        backgroundColor:'#2196F3',
        color:'white'
    },
    tagSelected: {
        backgroundColor:'orangered',
        color:'white'
    },
    quoteView : {
        marginTop: 20, 
        marginHorizontal: 20
    },
    quote: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'serif',
        fontStyle: 'italic',
        backgroundColor: '#ffd70099',
        padding: 18,
        borderRadius: 4
    },
    author: {
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    tag: {
        marginHorizontal: 4,
        marginVertical: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagText: {
        textAlign: 'center',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 4
    },
    input: {
        flexDirection: "row",
        marginTop: 10
    },
    inputText: {
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 4
    },
    result: {
        fontFamily: 'monospace',
        fontSize: 12,
        marginTop: 16
    },  
    footer: {
        marginTop: 60,
        marginBottom: 20,
        alignItems: 'center'
    },
    footerText: {
        fontFamily: 'monospace',
        fontSize: 10
    }
});

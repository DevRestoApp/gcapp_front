import React from "react";
import { View, Text, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { bottomNavigationStyles } from "../styles/general/BottomNavigation.styles";

export default function BottomNavigation({
    state,
    descriptors,
    navigation,
}: BottomTabBarProps) {
    return (
        <View style={bottomNavigationStyles.bottomNav}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                          ? options.title
                          : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <Pressable key={route.key} onPress={onPress}>
                        <Text
                            style={
                                isFocused
                                    ? bottomNavigationStyles.navActive
                                    : bottomNavigationStyles.navText
                            }
                        >
                            {label as string}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { theme } from '../constants/theme';
import { LanguageButtonProps } from '../common/dto/ILanguageButtonProps';

const LanguageButton: React.FC<LanguageButtonProps> = ({ languageCode, currentLanguage, onPress, label, countryCode }) => {
    const isSelected = currentLanguage === languageCode;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#FFEBEE' : '#FFFFFF',
                    borderColor: isSelected ? theme.COLORS.primary : '#CCCCCC',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    marginHorizontal: 5,
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        color: isSelected ? theme.COLORS.primary : '#000000',
                        fontWeight: 'bold',
                        marginRight: 5,
                    }}
                >
                    {countryCode}
                </Text>
                <Text
                    style={{
                        color: isSelected ? theme.COLORS.primary : '#000000',
                        fontWeight: 'bold',
                        fontSize: theme.FONT_SIZES.subtitle,
                    }}
                >
                    {label}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LanguageButton;
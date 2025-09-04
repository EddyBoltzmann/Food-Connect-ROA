import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  ${({ theme }) => theme.shadows.sm};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const FilterButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search restaurants, dishes..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleFilter = () => {
    // TODO: Open filter modal
    console.log('Open filters');
  };

  return (
    <SearchContainer>
      <FilterButton onPress={handleFilter}>
        <Icon name="tune" size={20} color="#6B7280" />
      </FilterButton>
      
      <SearchInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      
      <SearchButton onPress={handleSearch}>
        <Icon name="search" size={20} color="#FFFFFF" />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchBar;
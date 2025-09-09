import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

interface PasswordValidity {
    minLength: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
}

const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <li className={`flex items-center text-xs transition-colors ${met ? 'text-green-400' : 'text-gray-400'}`}>
        {met ? (
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        ) : (
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
        )}
        <span>{text}</span>
    </li>
);

const LoginPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login, signup, socialLogin, isLoading } = useAuth();
    
    // Form States
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [passwordValidity, setPasswordValidity] = useState<PasswordValidity>({
        minLength: false,
        hasNumber: false,
        hasSymbol: false,
    });

    useEffect(() => {
        if (!isLoginView) { // Only run validation on the signup form
            setPasswordValidity({
                minLength: password.length >= 8,
                hasNumber: /\d/.test(password),
                hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            });
        }
    }, [password, isLoginView]);


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginView) {
                if (!email || !password) {
                    setError('Please enter both email and password.');
                    return;
                }
                await login(email, password);
            } else {
                if (!fullName || !username || !email || !password || !confirmPassword) {
                    setError('Please fill out all mandatory fields.');
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    return;
                }
                const { minLength, hasNumber, hasSymbol } = passwordValidity;
                if (!minLength || !hasNumber || !hasSymbol) {
                    let errorMsg = 'Password must meet all requirements:';
                    if (!minLength) errorMsg += ' be at least 8 characters,';
                    if (!hasNumber) errorMsg += ' contain a number,';
                    if (!hasSymbol) errorMsg += ' contain a symbol.';
                    setError(errorMsg.slice(0, -1) + '.');
                    return;
                }
                // In a real app, you would get Role and Language from stateful form inputs.
                // For this example, we'll use defaults.
                await signup({ 
                    fullName, 
                    username, 
                    email, 
                    password,
                    profilePhoto: profilePhotoPreview || undefined,
                    role: 'YouTuber',
                    preferredLanguage: Language.English,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setPassword('');
        setConfirmPassword('');
    };
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePhotoPreview(null);
        }
    };

    const renderInputField = (id: string, label: string, type: string, value: string, setter: (val: string) => void, placeholder = '', required = true) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">
                {label}{required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                autoComplete={id}
                required={required}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                 <div className="flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-red-600" viewBox="0 0 28 20" fill="currentColor">
                        <path d="M27.323 3.107A3.523 3.523 0 0 0 24.84 .624C22.665 0 14 0 14 0S5.335 0 3.16.624A3.523 3.523 0 0 0 .677 3.107C0 5.282 0 10 0 10s0 4.718.677 6.893a3.523 3.523 0 0 0 2.483 2.483C5.335 20 14 20 14 20s8.665 0 10.84-.624a3.523 3.523 0 0 0 2.483-2.483C28 14.718 28 10 28 10s0-4.718-.677-6.893zM11.2 14V6l6.8 4-6.8 4z"/>
                    </svg>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Thumbnail AI
                    </h1>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white">
                    {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-700">
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        {!isLoginView && renderInputField('fullName', 'Full Name', 'text', fullName, setFullName, '')}
                        {!isLoginView && renderInputField('username', 'Username', 'text', username, setUsername, '')}
                        {renderInputField('email', 'Email address', 'email', email, setEmail, 'you@example.com')}
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password<span className="text-red-400 ml-1">*</span></label>
                            <div className="relative mt-1">
                                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********"
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 pr-10" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A10.025 10.025 0 00.458 10c1.274 4.057 5.022 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {!isLoginView && (
                                <ul className="mt-2 space-y-1">
                                    <PasswordRequirement met={passwordValidity.minLength} text="At least 8 characters" />
                                    <PasswordRequirement met={passwordValidity.hasNumber} text="Contains a number (e.g. 1, 2, 3)" />
                                    <PasswordRequirement met={passwordValidity.hasSymbol} text="Contains a symbol (e.g. $, !, #)" />
                                </ul>
                            )}
                        </div>

                        {!isLoginView && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password<span className="text-red-400 ml-1">*</span></label>
                                <div className="relative mt-1">
                                    <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********"
                                        className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-indigo-500 focus:border-indigo-500 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A10.025 10.025 0 00.458 10c1.274 4.057 5.022 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}


                        {!isLoginView && (
                            <div className="space-y-4 pt-4 border-t border-gray-700">
                                <h3 className="text-sm font-medium text-gray-400">Optional Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Profile Photo (Optional)</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        {profilePhotoPreview ? (
                                            <img src={profilePhotoPreview} alt="Profile preview" className="h-16 w-16 rounded-full object-cover" />
                                        ) : (
                                            <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-700">
                                                <svg className="h-full w-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </span>
                                        )}
                                        <div>
                                            <label htmlFor="profilePhotoInput" className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
                                                Upload Photo
                                            </label>
                                            <input id="profilePhotoInput" name="profilePhotoInput" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role/Interest</label>
                                    <select id="role" name="role" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>YouTuber</option>
                                        <option>Gamer</option>
                                        <option>Educator</option>
                                        <option>Vlogger</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-300">Preferred Language</label>
                                    <select id="language" name="language" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white focus:ring-indigo-500 focus:border-indigo-500">
                                        {Object.values(Language).map(lang => <option key={lang}>{lang}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-3 rounded-md text-center text-sm flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                                {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div>
                                <button onClick={() => socialLogin('google')} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-white text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    <svg className="w-5 h-5 mr-3" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </button>
                            </div>

                            <div>
                                <button onClick={() => socialLogin('facebook')} disabled={isLoading} className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#1877F2] text-sm font-medium text-white hover:bg-[#166fe5] disabled:opacity-50">
                                    <svg className="w-5 h-5 mr-3" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                    Sign in with Facebook
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-400">
                            {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                            <button onClick={toggleView} disabled={isLoading} className="font-medium text-indigo-400 hover:text-indigo-300 ml-2 disabled:opacity-50">
                                {isLoginView ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
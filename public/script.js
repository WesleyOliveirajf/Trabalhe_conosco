document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('candidaturaForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    // Elementos do formulário
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const paisSelect = document.getElementById('pais');
    const cargoInput = document.getElementById('cargo');
    const curriculoInput = document.getElementById('curriculo');
    const alertasCheckbox = document.getElementById('alertas');

    // Máscara para telefone brasileiro
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });

    // Validação em tempo real
    function validateField(field, errorElementId, validationFn) {
        const errorElement = document.getElementById(errorElementId);
        
        field.addEventListener('blur', function() {
            const result = validationFn(field.value);
            
            if (result.isValid) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                errorElement.textContent = '';
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                errorElement.textContent = result.message;
            }
        });
        
        field.addEventListener('input', function() {
            if (field.classList.contains('invalid')) {
                const result = validationFn(field.value);
                if (result.isValid) {
                    field.classList.remove('invalid');
                    field.classList.add('valid');
                    errorElement.textContent = '';
                }
            }
        });
    }

    // Funções de validação
    const validators = {
        nome: (value) => {
            if (!value.trim()) {
                return { isValid: false, message: 'Nome é obrigatório.' };
            }
            if (value.trim().length < 2) {
                return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres.' };
            }
            return { isValid: true };
        },
        
        sobrenome: (value) => {
            if (!value.trim()) {
                return { isValid: false, message: 'Sobrenome é obrigatório.' };
            }
            if (value.trim().length < 2) {
                return { isValid: false, message: 'Sobrenome deve ter pelo menos 2 caracteres.' };
            }
            return { isValid: true };
        },
        
        email: (value) => {
            if (!value.trim()) {
                return { isValid: false, message: 'E-mail é obrigatório.' };
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { isValid: false, message: 'Por favor, insira um e-mail válido.' };
            }
            return { isValid: true };
        },
        
        telefone: (value) => {
            if (!value.trim()) {
                return { isValid: false, message: 'Telefone é obrigatório.' };
            }
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                return { isValid: false, message: 'Formato: (XX) XXXXX-XXXX' };
            }
            return { isValid: true };
        },
        
        pais: (value) => {
            if (!value) {
                return { isValid: false, message: 'Por favor, selecione um país.' };
            }
            return { isValid: true };
        },
        
        cargo: (value) => {
            // Campo opcional - sempre válido
            return { isValid: true };
        },
        
        curriculo: (file) => {
            if (!file) {
                return { isValid: false, message: 'Por favor, selecione um arquivo de currículo.' };
            }
            
            const allowedTypes = ['.doc', '.docx', '.pdf', '.txt'];
            const fileName = file.name.toLowerCase();
            const isValidType = allowedTypes.some(type => fileName.endsWith(type));
            
            if (!isValidType) {
                return { isValid: false, message: 'Tipo de arquivo não permitido. Use .DOC, .DOCX, .PDF ou .TXT' };
            }
            
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                return { isValid: false, message: 'Arquivo muito grande. Tamanho máximo: 5MB' };
            }
            
            return { isValid: true };
        }
    };

    // Aplicar validação aos campos
    validateField(nomeInput, 'nome-error', validators.nome);
    validateField(sobrenomeInput, 'sobrenome-error', validators.sobrenome);
    validateField(emailInput, 'email-error', validators.email);
    validateField(telefoneInput, 'telefone-error', validators.telefone);
    validateField(paisSelect, 'pais-error', validators.pais);
    validateField(cargoInput, 'cargo-error', validators.cargo);

    // Validação especial para arquivo
    curriculoInput.addEventListener('change', function() {
        const errorElement = document.getElementById('curriculo-error');
        const result = validators.curriculo(this.files[0]);
        
        if (result.isValid) {
            this.classList.remove('invalid');
            this.classList.add('valid');
            errorElement.textContent = '';
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
            errorElement.textContent = result.message;
        }
    });

    // Função para validar todo o formulário
    function validateForm() {
        let isValid = true;
        const fields = [
            { element: nomeInput, validator: validators.nome, errorId: 'nome-error' },
            { element: sobrenomeInput, validator: validators.sobrenome, errorId: 'sobrenome-error' },
            { element: emailInput, validator: validators.email, errorId: 'email-error' },
            { element: telefoneInput, validator: validators.telefone, errorId: 'telefone-error' },
            { element: paisSelect, validator: validators.pais, errorId: 'pais-error' },
            { element: cargoInput, validator: validators.cargo, errorId: 'cargo-error' }
        ];

        fields.forEach(field => {
            const result = field.validator(field.element.value);
            const errorElement = document.getElementById(field.errorId);
            
            if (!result.isValid) {
                field.element.classList.add('invalid');
                field.element.classList.remove('valid');
                errorElement.textContent = result.message;
                isValid = false;
            } else {
                field.element.classList.remove('invalid');
                field.element.classList.add('valid');
                errorElement.textContent = '';
            }
        });

        // Validar arquivo
        const curriculoResult = validators.curriculo(curriculoInput.files[0]);
        const curriculoError = document.getElementById('curriculo-error');
        
        if (!curriculoResult.isValid) {
            curriculoInput.classList.add('invalid');
            curriculoInput.classList.remove('valid');
            curriculoError.textContent = curriculoResult.message;
            isValid = false;
        } else {
            curriculoInput.classList.remove('invalid');
            curriculoInput.classList.add('valid');
            curriculoError.textContent = '';
        }

        return isValid;
    }

    // Função para mostrar mensagem
    function showMessage(type, message = null) {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        if (type === 'success') {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (type === 'error') {
            if (message) {
                errorText.textContent = message;
            }
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Função para resetar o formulário
    function resetForm() {
        form.reset();
        document.querySelectorAll('.valid, .invalid').forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    // Submissão do formulário
    // Dentro da função de submit do formulário, altere a URL:
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Esconder mensagens anteriores
        showMessage('hide');
        
        // Validar formulário
        if (!validateForm()) {
            showMessage('error', 'Por favor, corrija os erros no formulário antes de enviar.');
            return;
        }

        // Mostrar loading
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';

        try {
            // Preparar dados do formulário
            const formData = new FormData();
            formData.append('nome', nomeInput.value.trim());
            formData.append('sobrenome', sobrenomeInput.value.trim());
            formData.append('email', emailInput.value.trim());
            formData.append('telefone', telefoneInput.value.trim());
            formData.append('pais', paisSelect.value);
            formData.append('cargo', cargoInput.value.trim());
            formData.append('alertas', alertasCheckbox.checked ? 'sim' : 'nao');
            formData.append('curriculo', curriculoInput.files[0]);

            // Enviar dados
            const response = await fetch('/enviar-candidatura', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showMessage('success');
                resetForm();
            } else {
                showMessage('error', result.message);
            }

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showMessage('error', 'Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            // Restaurar botão
            submitBtn.disabled = false;
            submitText.style.display = 'inline-block';
            loadingSpinner.style.display = 'none';
        }
    });

    // Adicionar efeitos visuais
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});